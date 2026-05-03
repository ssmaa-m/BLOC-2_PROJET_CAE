package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.dtos.NotificationDto;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Notification;
import be.vinci.ipl.cae.demo.models.entities.NotificationType;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * Service class handling all notification-related business logic. Provides methods for individual,
 * group, and bulk notifications.
 */
@Service
public class NotificationService {

  private final MemberRepository memberRepository;
  private final NotificationRepository notificationRepository;

  /**
   * Constructs a new NotificationService with required repositories.
   *
   * @param memberRepository the repository for member data
   * @param notificationRepository the repository for notification data
   */
  public NotificationService(
      MemberRepository memberRepository,
      NotificationRepository notificationRepository) {
    this.memberRepository = memberRepository;
    this.notificationRepository = notificationRepository;
  }

  /**
   * Creates and saves a notification for a specific member identified by their ID.
   *
   * @param idMember the unique identifier of the member
   * @param content the text message of the notification
   * @throws IllegalArgumentException if the member is not found or content is blank
   */
  public void notifyMember(Long idMember, String content, NotificationType type, Long idReference) {

    Member member = memberRepository
        .findById(idMember)
        .orElseThrow(() -> new IllegalArgumentException("Member not found"));
    saveNotification(member, content, type, idReference);
  }

  /**
   * Sends a notification to all active members in the system. Active members are those where
   * isDeleted is false.
   *
   * @param content the text message of the notification
   */
  public void notifyAllMembers(String content, NotificationType type, Long idReference) {
    Member[] activeMembers = memberRepository.findAllByIsDeletedOrderByTagAsc(false);
    for (Member activeMember : activeMembers) {
      saveNotification(activeMember, content, type, idReference);
    }
  }

  /**
   * Sends a notification to every member currently belonging to a specific team.
   *
   * @param team the team entity whose members will be notified
   * @param content the text message of the notification
   */
  public void notifyTeam(Team team, String content, NotificationType type, Long idReference) {
    List<Member> teamMembers = team.getMembers();
    for (Member teamMember : teamMembers) {
      saveNotification(teamMember, content, type, idReference);
    }
  }

  /**
   * Sends a notification to the managers (responsables) of a team. Only attempts to notify managers
   * that are explicitly assigned (not null).
   *
   * @param team the team whose managers will be notified
   * @param content the text message of the notification
   */
  public void notifyTeamManagers(
      Team team,
      String content,
      NotificationType type,
      Long idReference) {
    Member manager1 = team.getManager1();
    Member manager2 = team.getManager2();
    if (manager1 != null) {
      saveNotification(manager1, content, type, idReference);
    }
    if (manager2 != null) {
      saveNotification(manager2, content, type, idReference);
    }
  }

  /**
   * Internal helper to persist a notification.
   *
   * @param member the member entity to associate with the notification
   * @param content the message content
   * @throws IllegalArgumentException if content is null or blank
   */
  private void saveNotification(
      Member member,
      String content,
      NotificationType type,
      Long idReference) {
    if (content == null || content.isBlank()) {
      throw new IllegalArgumentException("content must contain text");
    }
    Notification notification = new Notification();
    notification.setContent(content);
    notification.setMember(member);
    notification.setType(type);
    notification.setIdReference(idReference);
    notificationRepository.save(notification);
  }

  /**
   * Retrieves notifications for a specific member, optionally filtering for unread ones.
   *
   * @param idMember the unique identifier of the member
   * @param unreadOnly true to return only unread notifications, false for all
   * @return an iterable collection of notifications
   */
  public Iterable<NotificationDto> getNotificationsByIdMember(long idMember, boolean unreadOnly) {
    Iterable<Notification> entities;
    if (unreadOnly) {
      entities =
          notificationRepository.findByMemberIdMemberAndIsReadFalseOrderByDateTimeDesc(idMember);
    } else {
      entities = notificationRepository.findByMemberIdMemberOrderByIsReadAscDateTimeDesc(idMember);
    }
    List<NotificationDto> dtos = new ArrayList<>();
    for (Notification entity : entities) {
      dtos
          .add(
              new NotificationDto(
                  entity.getIdNotification(),
                  entity.getContent(),
                  entity.isRead(),
                  entity.getDateTime(),
                  entity.getType(),
                  entity.getIdReference()));
    }
    return dtos;
  }

  /**
   * Marks a specific notification as read.
   *
   * @param idNotification the unique identifier of the notification
   * @throws EntityNotFoundException if the notification does not exist
   */
  public void markNotificationAsRead(long idNotification) {
    Notification notification = notificationRepository
        .findById(idNotification)
        .orElseThrow(
            () -> new EntityNotFoundException("Notification not found with id: " + idNotification));
    notification.setRead(true);
    notificationRepository.save(notification);
  }

  /**
   * Counts the number of unread notifications for a specific member.
   *
   * @param idMember the unique identifier of the member
   * @return the total count of unread notifications
   */
  public long countUnreadNotifications(long idMember) {
    return notificationRepository.countByMemberIdMemberAndIsReadFalse(idMember);
  }

  /**
   * Finds a specific notification by its identifier.
   *
   * @param idNotification the unique identifier of the notification
   * @return an Optional containing the notification if found, or empty otherwise
   */
  public Optional<Notification> getById(Long idNotification) {
    return notificationRepository.getNotificationByIdNotification(idNotification);
  }

  /**
   * Notifies members who were recently added or removed from a lineup.
   *
   */
  public void notifyLineup(
      Set<Long> oldLineup,
      Set<Long> newLineup,
      Long tournamentId,
      Match match) {
    // Format the date and time once for reuse
    String date = match.getDateHour().toLocalDate().toString();
    String time =
        String.format("%02dh%02d", match.getDateHour().getHour(), match.getDateHour().getMinute());
    String matchInfo = date + " à " + time;

    // notify all removed members
    for (Long oldId : oldLineup) {
      if (!newLineup.contains(oldId)) {
        String message = String
            .format(
                "Changement de tactique ! 📋\n"
                    + "Tu ne fais plus partie de la composition pour le match du %s. "
                    + "Ce sera pour la prochaine fois !",
                matchInfo);
        notifyMember(oldId, message, NotificationType.TOURNAMENT, tournamentId);
      }
    }

    // notify all added Members
    for (Long newId : newLineup) {
      if (!oldLineup.contains(newId)) {
        String message = String
            .format(
                "Prépare-toi pour la bataille ! ⚔️\n"
                    + "Tu as été sélectionné dans l'équipe pour le match du %s. "
                    + "Donne tout sur le terrain !",
                matchInfo);
        notifyMember(newId, message, NotificationType.TOURNAMENT, tournamentId);
      }
    }
  }

}


