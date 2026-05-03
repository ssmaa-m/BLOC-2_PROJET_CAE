package be.vinci.ipl.cae.demo.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import be.vinci.ipl.cae.demo.models.dtos.NotificationDto;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Notification;
import be.vinci.ipl.cae.demo.models.entities.NotificationType;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.NotificationRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

  @Mock
  private NotificationRepository notificationRepository;
  @Mock
  private MemberRepository memberRepository;
  @InjectMocks
  private NotificationService notificationService;

  private Member createMember(Long id) {
    Member m = new Member();
    m.setIdMember(id);
    return m;
  }

  private Notification createNotification(
      Long id,
      String content,
      Member member,
      boolean isRead,
      NotificationType type,
      Long idReference) {
    Notification n = new Notification();
    n.setIdNotification(id);
    n.setContent(content);
    n.setMember(member);
    n.setRead(isRead);
    n.setType(type);
    n.setIdReference(idReference);
    return n;
  }

  private void assertSavedNotification(
      Notification captured,
      Member expectedMember,
      String expectedContent,
      NotificationType expectedType,
      Long expectedReference) {
    assertEquals(expectedMember, captured.getMember());
    assertEquals(expectedContent, captured.getContent());
    assertEquals(expectedType, captured.getType());
    assertEquals(expectedReference, captured.getIdReference());
  }

  private List<Notification> captureNotifications(int times) {
    ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
    verify(notificationRepository, times(times)).save(captor.capture());
    return captor.getAllValues();
  }

  @Test
  @DisplayName("Should notify member with correct data")
  void notifyMember_Success() {
    Long memberId = 1L;
    Member mockMember = createMember(memberId);
    when(memberRepository.findById(memberId)).thenReturn(Optional.of(mockMember));

    notificationService.notifyMember(memberId, "hi", NotificationType.TEAM, 10L);

    List<Notification> captured = captureNotifications(1);
    assertSavedNotification(captured.get(0), mockMember, "hi", NotificationType.TEAM, 10L);
  }

  @Test
  @DisplayName("Should throw IllegalArgumentException when member ID does not exist")
  void notifyMember_MemberNotFound() {
    when(memberRepository.findById(999L)).thenReturn(Optional.empty());
    assertThrows(IllegalArgumentException.class,
        () -> notificationService.notifyMember(999L, "hi", NotificationType.MATCH, 20L));
  }

  @Test
  @DisplayName("Should notify all members with correct data")
  void notifyAllMembers_Success() {
    Member m1 = createMember(1L);
    Member m2 = createMember(2L);
    when(memberRepository.findAllByIsDeletedOrderByTagAsc(false)).thenReturn(new Member[] {m1, m2});

    notificationService.notifyAllMembers("hi everyone", NotificationType.TOURNAMENT, 30L);

    List<Notification> captured = captureNotifications(2);
    assertSavedNotification(captured.get(0), m1, "hi everyone", NotificationType.TOURNAMENT, 30L);
    assertSavedNotification(captured.get(1), m2, "hi everyone", NotificationType.TOURNAMENT, 30L);
  }

  @Test
  @DisplayName("Should not call save when there are no active members")
  void notifyAllMembers_EmptyList() {
    when(memberRepository.findAllByIsDeletedOrderByTagAsc(false)).thenReturn(new Member[0]);
    notificationService.notifyAllMembers("Hi", NotificationType.TEAM, 40L);
    verify(notificationRepository, never()).save(any());
  }

  @Test
  @DisplayName("Should notify all members of a given team")
  void notifyTeam() {
    Member m1 = createMember(1L);
    Member m2 = createMember(2L);
    Team team = new Team();
    team.setIdTeam(5L); // Set ID for reference check
    team.getMembers().add(m1);
    team.getMembers().add(m2);

    notificationService.notifyTeam(team, "hi", NotificationType.TEAM, team.getIdTeam());

    List<Notification> captured = captureNotifications(2);
    assertSavedNotification(captured.get(0), m1, "hi", NotificationType.TEAM, 5L);
    assertSavedNotification(captured.get(1), m2, "hi", NotificationType.TEAM, 5L);
  }

  @Test
  @DisplayName("Should only notify managers of a given team")
  void notifyTeamManagers() {
    Member m1 = createMember(1L);
    Team team = new Team();
    team.setIdTeam(5L);
    team.setManager1(m1);

    notificationService.notifyTeamManagers(team, "hi", NotificationType.TEAM, team.getIdTeam());

    List<Notification> captured = captureNotifications(1);
    assertSavedNotification(captured.get(0), m1, "hi", NotificationType.TEAM, 5L);
  }

  @Test
  @DisplayName("Should return all notifications of a member as DTOs")
  void getNotificationsByIdMember() {
    long memberId = 1L;
    Member m1 = createMember(memberId);
    Notification n1 = createNotification(100L, "First Notif", m1, true, NotificationType.TEAM, 10L);
    Notification n2 =
        createNotification(101L, "Second Notif", m1, false, NotificationType.MATCH, 20L);

    when(notificationRepository.findByMemberIdMemberOrderByIsReadAscDateTimeDesc(memberId))
        .thenReturn(List.of(n1, n2));

    Iterable<NotificationDto> result =
        notificationService.getNotificationsByIdMember(memberId, false);
    List<NotificationDto> dtoList = new ArrayList<>();
    result.forEach(dtoList::add);

    assertEquals(2, dtoList.size());
    assertEquals("First Notif", dtoList.getFirst().content());
    assertEquals(NotificationType.TEAM, dtoList.getFirst().type());
    assertEquals(10L, dtoList.get(0).idReference());
    assertTrue(dtoList.get(0).isRead());
    assertFalse(dtoList.get(1).isRead());

    verify(notificationRepository).findByMemberIdMemberOrderByIsReadAscDateTimeDesc(memberId);
  }
}
