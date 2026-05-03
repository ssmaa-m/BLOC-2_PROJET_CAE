package be.vinci.ipl.cae.demo.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.eq;

import be.vinci.ipl.cae.demo.models.dtos.JoinRequestDto;
import be.vinci.ipl.cae.demo.models.entities.JoinRequest;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.NotificationType;
import be.vinci.ipl.cae.demo.models.entities.RequestStatus;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.JoinRequestRepository;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import be.vinci.ipl.cae.demo.exceptions.*;

@ExtendWith(MockitoExtension.class)
class JoinRequestServiceTest {

  @Mock
  private JoinRequestRepository joinRequestRepository;

  @Mock
  private TeamService teamService;

  @Mock
  private NotificationService notificationService;

  @Mock
  private MemberRepository memberRepository;

  @InjectMocks
  private JoinRequestService joinRequestService;

  private Member requester;
  private Team team;

  @BeforeEach
  void setUp() {
    requester = new Member();
    requester.setIdMember(1L);
    requester.setTag("PlayerOne");
    requester.setTeam(null);

    team = new Team();
    team.setIdTeam(2L);
    team.setName("Team Name");
  }

  @Test
  void createJoinRequest_Valid() {
    when(teamService.getExistingTeam(2L)).thenReturn(team);
    when(joinRequestRepository.existsByMemberAndRequestedTeamAndStatus(requester, team,
        RequestStatus.PENDING))
        .thenReturn(false);
    when(joinRequestRepository.save(any(JoinRequest.class))).thenAnswer(call -> {
      JoinRequest saved = call.getArgument(0);
      saved.setIdJoinRequest(10L);
      return saved;
    });

    JoinRequestDto result = joinRequestService.createJoinRequest(2L, requester);

    assertNotNull(result);
    assertEquals(10L, result.getIdJoinRequest());
    assertEquals(2L, result.getIdTeam());
    assertEquals("Team Name", result.getTeamName());
    verify(joinRequestRepository).save(any(JoinRequest.class));

    // verify with type and reference
    verify(notificationService).notifyTeamManagers(eq(team), anyString(), eq(NotificationType.TEAM),
        eq(team.getIdTeam()));
  }

  @Test
  void createJoinRequest_TeamNotFound() {
    when(teamService.getExistingTeam(2L)).thenThrow(new TeamNotFoundException("L'équipe demandée n'existe pas"));

    TeamNotFoundException exception = assertThrows(TeamNotFoundException.class,
        () -> joinRequestService.createJoinRequest(2L, requester));

    assertEquals("L'équipe demandée n'existe pas", exception.getMessage());
    verify(joinRequestRepository, never()).save(any(JoinRequest.class));
  }

  @Test
  void createJoinRequest_AlreadyInTeam() {
    Team anotherTeam = new Team();
    anotherTeam.setIdTeam(3L);
    requester.setTeam(anotherTeam);

    when(teamService.getExistingTeam(2L)).thenReturn(team);

    UserAlreadyInTeamException exception = assertThrows(
        UserAlreadyInTeamException.class,
        () -> joinRequestService.createJoinRequest(2L, requester));

    assertEquals("Vous appartenez déjà à une équipe", exception.getMessage());
    verify(joinRequestRepository, never()).save(any(JoinRequest.class));
  }

  @Test
  void createJoinRequest_PendingRequestExists() {
    when(teamService.getExistingTeam(2L)).thenReturn(team);
    when(joinRequestRepository.existsByMemberAndRequestedTeamAndStatus(requester, team,
        RequestStatus.PENDING))
        .thenReturn(true);

    JoinRequestAlreadyExistsException exception = assertThrows(JoinRequestAlreadyExistsException.class,
        () -> joinRequestService.createJoinRequest(2L, requester));

    assertEquals("Vous avez déjà une demande en attente pour cette équipe", exception.getMessage());
    verify(joinRequestRepository, never()).save(any(JoinRequest.class));
  }

  @Test
  void updateJoinRequestStatus_Accepted() {
    // Arrange
    Team teamA = new Team();
    teamA.setIdTeam(1L);
    teamA.setName("Team A");
    Member manager = new Member();
    manager.setIdMember(10L);
    teamA.setManager1(manager);

    JoinRequest jr = new JoinRequest();
    jr.setIdJoinRequest(100L);
    jr.setMember(requester);
    jr.setRequestedTeam(teamA);
    jr.setStatus(RequestStatus.PENDING);

    when(joinRequestRepository.findById(100L)).thenReturn(Optional.of(jr));

    // Act
    JoinRequestDto result =
        joinRequestService.updateJoinRequestStatus(100L, RequestStatus.ACCEPTED, null, manager);

    // Assert
    assertNotNull(result);
    assertEquals(RequestStatus.ACCEPTED, result.getStatus());
    assertEquals(teamA, requester.getTeam());
    verify(joinRequestRepository).save(jr);
    verify(memberRepository).save(requester);

    // verify with type and reference
    verify(notificationService)
        .notifyMember(
            eq(requester.getIdMember()),
            anyString(),
            eq(NotificationType.TEAM),
            eq(null));

    verify(joinRequestRepository).deleteAllByMemberAndStatus(requester, RequestStatus.PENDING);
  }

  @Test
  void updateJoinRequestStatus_Rejected() {
    // Arrange
    Team teamA = new Team();
    teamA.setIdTeam(1L);
    teamA.setName("Team A");
    Member manager = new Member();
    manager.setIdMember(10L);
    teamA.setManager1(manager);

    JoinRequest jr = new JoinRequest();
    jr.setIdJoinRequest(100L);
    jr.setMember(requester);
    jr.setRequestedTeam(teamA);
    jr.setStatus(RequestStatus.PENDING);

    when(joinRequestRepository.findById(100L)).thenReturn(Optional.of(jr));

    // Act
    JoinRequestDto result = joinRequestService
        .updateJoinRequestStatus(100L, RequestStatus.REJECTED, "Pas de place", manager);

    // Assert
    assertNotNull(result);
    assertEquals(RequestStatus.REJECTED, result.getStatus());
    verify(joinRequestRepository).save(jr);

    // verify with type and reference
    verify(notificationService)
        .notifyMember(
            eq(requester.getIdMember()),
            anyString(),
            eq(NotificationType.TEAM),
            eq(null));

    verify(memberRepository, never()).save(any(Member.class));
    verify(joinRequestRepository, never()).deleteAllByMemberAndStatus(any(), any());
  }

  @Test
  void updateJoinRequestStatus_NotManager() {
    // Arrange
    Team teamA = new Team();
    teamA.setIdTeam(1L);
    Member manager = new Member();
    manager.setIdMember(10L);
    teamA.setManager1(manager);

    JoinRequest jr = new JoinRequest();
    jr.setStatus(RequestStatus.PENDING);
    jr.setRequestedTeam(teamA);

    Member intruder = new Member();
    intruder.setIdMember(99L);

    when(joinRequestRepository.findById(100L)).thenReturn(Optional.of(jr));
    doThrow(new NotManagerException("L'utilisateur n'a pas les droits de responsable."))
        .when(teamService)
        .requireManager(teamA, intruder);

    // Act & Assert
    assertThrows(
        NotManagerException.class,
        () -> joinRequestService
            .updateJoinRequestStatus(100L, RequestStatus.ACCEPTED, null, intruder));
  }

  @Test
  void updateJoinRequestStatus_RejectedWithoutReason_ShouldFail() {
    // Arrange
    Team teamA = new Team();
    teamA.setIdTeam(1L);

    Member manager = new Member();
    manager.setIdMember(10L);
    teamA.setManager1(manager);

    JoinRequest jr = new JoinRequest();
    jr.setStatus(RequestStatus.PENDING);
    jr.setRequestedTeam(teamA);

    when(joinRequestRepository.findById(100L)).thenReturn(Optional.of(jr));

    // Act & Assert
    assertThrows(
        InvalidJoinRequestException.class,
        () -> joinRequestService
            .updateJoinRequestStatus(100L, RequestStatus.REJECTED, null, manager));
  }
}
