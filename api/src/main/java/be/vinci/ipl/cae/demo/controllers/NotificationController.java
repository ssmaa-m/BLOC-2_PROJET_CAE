package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.NotificationDto;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Notification;
import be.vinci.ipl.cae.demo.services.NotificationService;
import java.util.Objects;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Notifications Controller.
 */
@RestController
@RequestMapping("/notifications")
public class NotificationController {

  private final NotificationService notificationService;

  /**
   * Constructor initializes notificationService.
   *
   * @param notificationService = service
   */
  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  /**
   * Route GET /notifications/member/{id}.
   *
   * @return list of Notifications that belongs to the User
   */
  @GetMapping("/member/me")
  @PreAuthorize("isAuthenticated()")
  public Iterable<NotificationDto> listNotifications(
      @RequestParam(required = false, defaultValue = "false") boolean unreadOnly,
      @AuthenticationPrincipal Member currentMember) {
    return notificationService.getNotificationsByIdMember(currentMember.getIdMember(), unreadOnly);
  }

  /**
   * Route PATCH notifications/{id}/read.
   *
   * @param id id of the notification
   */
  @PatchMapping("/{id}/read")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PreAuthorize("isAuthenticated()")
  public void markAsRead(@PathVariable long id, @AuthenticationPrincipal Member currentMember) {
    Optional<Notification> notification = notificationService.getById(id);
    if (notification.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    long idMember = notification.get().getMember().getIdMember();
    if (!Objects.equals(currentMember.getIdMember(), idMember)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    notificationService.markNotificationAsRead(id);
  }

  /**
   * Route GET /notifications/member/{id}/unread-count.
   *
   * @return nb of unread notifs
   */
  @GetMapping("/member/me/unread-count")
  @PreAuthorize("isAuthenticated()")
  public long countUnreadNotifications(@AuthenticationPrincipal Member currentMember) {
    return notificationService.countUnreadNotifications(currentMember.getIdMember());
  }
}
