package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.exceptions.*;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import be.vinci.ipl.cae.demo.models.dtos.FullTeamDto;
import be.vinci.ipl.cae.demo.models.dtos.TeamDetailsDto;
import be.vinci.ipl.cae.demo.models.dtos.UserSummaryDto;
import be.vinci.ipl.cae.demo.models.entities.JoinRequest;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.RequestStatus;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.JoinRequestRepository;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.TeamRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

  @Mock
  private TeamRepository teamRepository;

  @Mock
  private MemberRepository memberRepository;

  @Mock
  private JoinRequestRepository joinRequestRepository;

  @Mock
  private MemberService memberService;

  @InjectMocks
  private TeamService teamService;

  private Member creator;

  @BeforeEach
  void setUp() {
    // New Team-less member
    creator = new Member();
    creator.setIdMember(1L);
    creator.setEmail("player@example.com");
    creator.setTeam(null);
  }

  @Test
  void createTeamValid() {
    // Arrange
    when(teamRepository.existsByName("My Team")).thenReturn(false);
    when(teamRepository.save(any(Team.class))).thenAnswer(call -> {
      Team saved = call.getArgument(0);
      saved.setIdTeam(1L);
      return saved;
    });
    when(memberRepository.save(any(Member.class))).thenReturn(creator);

    // Act
    Team result = teamService.createTeam("My Team", creator);

    // Assert
    assertNotNull(result);
    assertEquals("My Team", result.getName());
    assertTrue(result.getIsActive());
    assertEquals(creator, result.getManager1());
    assertEquals(result, creator.getTeam());
    verify(teamRepository).save(any(Team.class));
    verify(memberRepository).save(creator);
  }

  @Test
  void createTeamDuplicateName() {
    // Arrange
    when(teamRepository.existsByName("Taken Name")).thenReturn(true);

    // Act + Assert
    assertThrows(TeamNameAlreadyTakenException.class, () ->
      teamService.createTeam("Taken Name", creator)
    );
    verify(teamRepository, never()).save(any(Team.class));
    verify(memberRepository, never()).save(any(Member.class));
  }

  @Test
  void createTeamMemberAlreadyInTeam() {
    // Arrange
    Team existingTeam = new Team();
    existingTeam.setIdTeam(5L);
    creator.setTeam(existingTeam);

    when(teamRepository.existsByName("New Team")).thenReturn(false);

    // Act + Assert
    assertThrows(
        UserAlreadyInTeamException.class,
        () -> teamService.createTeam("New Team", creator));
    verify(memberRepository, never()).save(any(Member.class));
    verify(teamRepository, never()).save(any(Team.class));
  }

  @Test
  void getAllTeams() {
    // Arrange
    Team team1 = new Team();
    team1.setName("Team 1");
    Team team2 = new Team();
    team2.setName("Team 2");
    Team teamInactive = new Team();
    teamInactive.setIsActive(false);

    when(teamRepository.findAll(any(), any(Sort.class))).thenReturn(List.of(team1, team2));

    // Act
    List<FullTeamDto> result = teamService.getAllTeams(true, null);

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("Team 1", result.get(0).getName());
    assertEquals("Team 2", result.get(1).getName());
    verify(teamRepository).findAll(any(), any(Sort.class));
  }

  @Test
  void designateSecondManagerForAnUnexistingTeam() {
    // Arrange
    when(teamRepository.findById(1L)).thenReturn(Optional.empty());

    // Act + Assert
    assertThrows(TeamNotFoundException.class, () ->
      teamService.designateSecondManager(1L, 2L, creator)
    );
  }

  @Test
  void designateSecondManagerAsNonManagerOfTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Act + Assert
    assertThrows(
        NotManagerException.class,
        () -> teamService.designateSecondManager(1L, 2L, creator));
  }

  @Test
  void designateSecondManagerWithUnexistingDesignatedMember() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager1(creator);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberRepository.findById(2L)).thenReturn(Optional.empty());

    // Act + Assert
    assertThrows(
        MemberNotFoundException.class,
        () -> teamService.designateSecondManager(1L, 2L, creator));
  }

  @Test
  void designateSecondManagerWithDesignatedMemberBelongingToNoTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager1(creator);

    Member lonely = new Member();
    lonely.setIdMember(2L);
    lonely.setTeam(null);

    when(memberRepository.findById(2L)).thenReturn(Optional.of(lonely));
    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Act + Assert
    assertThrows(
        UserNotInTeamException.class,
        () -> teamService.designateSecondManager(1L, 2L, creator));
  }

  @Test
  void designateSecondManagerWithDesignatedMemberBelongingToADifferentTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager1(creator);

    Team anotherTeam = new Team();
    anotherTeam.setIdTeam(2L);

    Member memberOfAnotherTeam = new Member();
    memberOfAnotherTeam.setIdMember(2L);
    memberOfAnotherTeam.setTeam(anotherTeam);

    when(memberRepository.findById(2L)).thenReturn(Optional.of(memberOfAnotherTeam));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Arrange + Act
    assertThrows(
        UserNotInTeamException.class,
        () -> teamService.designateSecondManager(1L, 2L, creator));
  }

  @Test
  void designateSecondManagerWithDesignatedMemberAlreadyManager2OfTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager1(creator);

    Member designatedMember = new Member();
    designatedMember.setIdMember(2L);
    designatedMember.setTeam(team);
    team.setManager2(designatedMember);

    when(memberRepository.findById(2L)).thenReturn(Optional.of(designatedMember));
    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Act
    Team result = teamService.designateSecondManager(1L, 2L, creator);

    // Assert
    assertEquals(team, result);
  }

  @Test
  void designateSecondManagerWithDesignatedMemberAlreadyManager1OfTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager2(creator);

    Member designatedMember = new Member();
    designatedMember.setIdMember(2L);
    designatedMember.setTeam(team);
    team.setManager1(designatedMember);

    when(memberRepository.findById(2L)).thenReturn(Optional.of(designatedMember));
    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Act
    teamService.designateSecondManager(1L, 2L, creator);
  }

  @Test
  void designateSecondManagerWithManager1SpotLeftInTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager2(creator);
    team.setManager1(null);

    Member designatedMember = new Member();
    designatedMember.setIdMember(2L);
    designatedMember.setTeam(team);
    when(memberRepository.findById(2L)).thenReturn(Optional.of(designatedMember));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(team)).thenReturn(team);

    // Act
    Team result = teamService.designateSecondManager(1L, 2L, creator);

    // Assert
    assertAll(
        () -> assertEquals(designatedMember, team.getManager1()),
        () -> assertEquals(team, result));
  }

  @Test
  void designateSecondManagerWithManager2SpotLeftInTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager1(creator);
    team.setManager2(null);

    Member designatedMember = new Member();
    designatedMember.setIdMember(2L);
    designatedMember.setTeam(team);
    when(memberRepository.findById(2L)).thenReturn(Optional.of(designatedMember));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(team)).thenReturn(team);

    // Act
    Team result = teamService.designateSecondManager(1L, 2L, creator);

    // Assert
    assertAll(
        () -> assertEquals(designatedMember, team.getManager2()),
        () -> assertEquals(team, result));
  }

  @Test
  void designateSecondManagerWithNoSpotLeftInTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    creator.setTeam(team);
    team.setManager1(creator);

    Member manager2 = new Member();
    manager2.setIdMember(2L);
    manager2.setTeam(team);
    team.setManager2(manager2);

    Member designatedMember = new Member();
    designatedMember.setIdMember(3L);
    designatedMember.setTeam(team);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberRepository.findById(3L)).thenReturn(Optional.of(designatedMember));

    // Act + Assert
    assertThrows(
        NoManagerSpotsLeftException.class,
        () -> teamService.designateSecondManager(1L, 3L, creator));
  }

  @Test
  void getTeamDetails_NotFound() {
    when(teamRepository.findById(1L)).thenReturn(Optional.empty());
    assertThrows(TeamNotFoundException.class, () ->
      teamService.getTeamDetails(1L, null)
    );
  }

  @Test
  void getTeamDetails_AsRegularMember() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    Member member1 = new Member();
    member1.setIdMember(10L);
    team.setMembers(List.of(member1));

    Member currentMember = new Member();
    currentMember.setIdMember(20L);
    currentMember.setEmail("user@test.com");

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberService.getUserSummary(member1))
        .thenReturn(UserSummaryDto.builder().id(10L).build());

    // Act
    TeamDetailsDto result = teamService.getTeamDetails(1L, currentMember);

    // Assert
    assertNotNull(result);
    assertEquals("Team 1", result.getName());
    assertEquals(1, result.getMembers().size());
    assertNull(result.getJoinRequests()); // Regular members do not see join requests
  }

  @Test
  void getTeamDetails_AsManager() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    Member manager = new Member();
    manager.setIdMember(10L);
    manager.setEmail("manager@test.com");
    team.setManager1(manager);
    team.setMembers(List.of());

    JoinRequest jr = new JoinRequest();
    jr.setIdJoinRequest(100L);
    jr.setMember(new Member());
    jr.getMember().setIdMember(30L);
    jr.setRequestedTeam(team);
    jr.setStatus(RequestStatus.PENDING);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberService.getUserSummary(manager))
        .thenReturn(UserSummaryDto.builder().id(10L).build());
    when(memberService.getUserSummary(jr.getMember()))
        .thenReturn(UserSummaryDto.builder().id(30L).build());
    when(joinRequestRepository.findAllByRequestedTeamAndStatus(team, RequestStatus.PENDING))
        .thenReturn(List.of(jr));

    // Act
    TeamDetailsDto result = teamService.getTeamDetails(1L, manager);

    // Assert
    assertNotNull(result);
    assertNotNull(result.getJoinRequests());
    assertEquals(1, result.getJoinRequests().size());
    assertEquals(100L, result.getJoinRequests().getFirst().getIdJoinRequest());
  }

  @Test
  void isManager1Manager1() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);

    team.setManager1(creator);
    creator.setTeam(team);

    team.setMembers(List.of(creator));

    // Act
    boolean result = teamService.isManager1(team, creator);

    // Assert
    assertTrue(result);
  }

  @Test
  void isManager1Manager2WithUnexistingManager2() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    team.setManager1(creator);

    creator.setTeam(team);

    team.setMembers(List.of(creator));

    // Act
    boolean result = teamService.isManager2(team, creator);

    // Assert
    assertFalse(result);
  }

  @Test
  void isManager1Manager2WithExistingManager2() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);

    team.setManager1(creator);
    creator.setTeam(team);

    Member manager2 = new Member();
    manager2.setIdMember(2L);
    manager2.setTeam(team);
    team.setManager2(manager2);

    team.setMembers(List.of(creator, manager2));

    // Act
    boolean result = teamService.isManager2(team, creator);

    // Assert
    assertFalse(result);
  }

  @Test
  void isManager2Manager2() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    team.setManager2(creator);

    Member manager1 = new Member();
    manager1.setIdMember(2L);
    manager1.setTeam(team);
    team.setManager1(manager1);

    team.setMembers(List.of(creator, manager1));

    creator.setTeam(team);

    // Act
    boolean result = teamService.isManager2(team, creator);

    // Assert
    assertTrue(result);
  }

  @Test
  void isManager2Manager1() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    team.setManager2(creator);

    Member manager1 = new Member();
    manager1.setIdMember(2L);
    manager1.setTeam(team);
    team.setManager1(manager1);

    team.setMembers(List.of(creator, manager1));

    creator.setTeam(team);

    // Act
    boolean result = teamService.isManager1(team, creator);

    // Assert
    assertFalse(result);
  }

  @Test
  void hasOtherManagerThanManager1WithUnexistingManager2() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    creator.setTeam(team);
    team.setManager1(creator);

    team.setMembers(List.of(creator));

    // Act
    boolean result = teamService.hasOtherManager(team, creator);

    // Assert
    assertAll(() -> assertNull(team.getManager2()), () -> assertFalse(result));
  }

  @Test
  void hasOtherManagerThanManager2WithExistingManager1() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    creator.setTeam(team);
    team.setManager1(creator);

    Member manager2 = new Member();
    manager2.setIdMember(2L);
    manager2.setTeam(team);
    team.setManager2(manager2);

    team.setMembers(List.of(creator, manager2));

    // Act
    boolean result = teamService.hasOtherManager(team, manager2);

    // Assert
    assertAll(() -> assertNotNull(team.getManager1()), () -> assertTrue(result));
  }

  @Test
  void quitTeamWithMemberWithNoTeam() {
    // Arrange

    // Act

    // Assert
    assertThrows(UserNotInTeamException.class, () -> teamService.quitTeam(creator));
  }

  @Test
  void quitTeamAsNonManager() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    creator.setTeam(team);
    team.setMembers(List.of(creator));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(any(Team.class))).thenReturn(team);

    // Act
    teamService.quitTeam(creator);

    // Assert
    assertNull(creator.getTeam());
  }

  @Test
  void quitTeamAsManager2() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    team.setManager2(creator);
    creator.setTeam(team);

    Member manager1 = new Member();
    manager1.setIdMember(2L);
    manager1.setTeam(team);
    team.setManager1(manager1);

    team.setMembers(List.of(creator, manager1));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(any(Team.class))).thenReturn(team);
    when(memberRepository.save(any(Member.class))).thenReturn(manager1);

    // Act
    teamService.quitTeam(creator);

    // Assert
    assertAll(() -> assertNull(creator.getTeam()), () -> assertNull(team.getManager2()));
  }

  @Test
  void quitTeamAsManager1WithNoOtherMembers() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    team.setManager1(creator);
    creator.setTeam(team);
    team.setMembers(List.of(creator));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(any(Team.class))).thenReturn(team);

    // Act
    // Team result = teamService.quitTeam(creator);
    teamService.quitTeam(creator);

    // Assert
    assertAll(
        () -> assertNull(team.getManager1()),
        () -> assertNull(creator.getTeam()),
        () -> assertFalse(team.getIsActive()));
  }

  @Test
  void quitTeamAsManager1WithOtherMembers() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);

    team.setManager1(creator);
    creator.setTeam(team);

    Member m2 = new Member();
    m2.setIdMember(2L);
    m2.setTeam(team);

    Member m3 = new Member();
    m3.setIdMember(3L);
    m3.setTeam(team);

    team.setMembers(List.of(creator, m2, m3));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Act

    // Assert
    // assertNull(result);
    assertThrows(LastManagerCannotQuitException.class, () -> teamService.quitTeam(creator));
  }

  @Test
  void quitTeamAsManager1WithExistingManager2() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    team.setName("Team 1");
    team.setIsActive(true);
    team.setManager1(creator);

    creator.setTeam(team);

    Member manager2 = new Member();
    manager2.setIdMember(2L);
    manager2.setTeam(team);
    team.setManager2(manager2);

    team.setMembers(List.of(creator, manager2));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(any(Team.class))).thenReturn(team);

    // Act
    teamService.quitTeam(creator);

    // Assert
    assertAll(
        () -> assertNull(creator.getTeam()),
        () -> assertEquals(team.getManager1(), manager2),
        () -> assertNull(team.getManager2()));
  }

  @Test
  void excludeUnexistingMember() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    when(memberRepository.findById(10L)).thenReturn(Optional.empty());

    // Act + Assert
    assertThrows(MemberNotFoundException.class, () -> teamService.excludeMember(team, 10L));
  }

  @Test
  void excludeMemberOfADifferentTeam() {
    // Arrange
    Team team1 = new Team();
    team1.setIdTeam(1L);

    Team team2 = new Team();
    team2.setIdTeam(2L);

    creator.setTeam(team2);

    when(memberRepository.findById(1L)).thenReturn(Optional.of(creator));

    // Act + Assert
    assertThrows(MemberNotInTeamException.class, () -> teamService.excludeMember(team1, 1L));
  }

  @Test
  void excludeMemberOfTheTeam() {
    // Arrange
    Team team1 = new Team();
    team1.setIdTeam(1L);

    creator.setTeam(team1);

    when(memberRepository.findById(1L)).thenReturn(Optional.of(creator));

    // Act
    teamService.excludeMember(team1, 1L);

    // Assert
    assertAll(
        () -> assertNull(creator.getTeam()),
        () -> assertFalse(team1.getMembers().contains(creator)));

    verify(memberRepository).save(creator);
    verify(teamRepository).save(team1);
  }

  @Test
  void resignManagerOfUnexistingTeam() {
    // Arrange
    long unexistingTeamId = 404L;
    when(teamRepository.findById(unexistingTeamId)).thenReturn(Optional.empty());

    // Assert
    assertThrows(
        TeamNotFoundException.class,
        () -> teamService.resignManager(unexistingTeamId, creator, null));
  }

  @Test
  void resignManagerAsMemberWhoIsNotManagerOfTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    Member manager1 = new Member();
    manager1.setIdMember(2L);
    manager1.setTeam(team);
    team.setManager1(manager1);

    creator.setTeam(team);

    team.setMembers(List.of(manager1, creator));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Assert
    assertThrows(NotManagerException.class, () -> teamService.resignManager(1L, creator, null));
  }

  @Test
  void resignManagerWithReplacementMemberUnexisting() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    creator.setTeam(team);
    team.setManager1(creator);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Assert
    assertThrows(MemberNotFoundException.class, () -> teamService.resignManager(1L, creator, 404L));
  }

  @Test
  void resignManagerWithReplacementMemberBelongingToNoTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    creator.setTeam(team);
    team.setManager1(creator);

    Member lonely = new Member();
    lonely.setIdMember(2L);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberRepository.findById(2L)).thenReturn(Optional.of(lonely));

    // Assert
    assertThrows(UserNotInTeamException.class, () -> teamService.resignManager(1L, creator, 2L));
  }

  @Test
  void resignManagerWithReplacementMemberBelongingToADifferentTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    creator.setTeam(team);
    team.setManager1(creator);

    Team anotherTeam = new Team();
    anotherTeam.setIdTeam(2L);

    Member memberOfAnotherTeam = new Member();
    memberOfAnotherTeam.setIdMember(2L);
    memberOfAnotherTeam.setTeam(anotherTeam);
    anotherTeam.setManager1(memberOfAnotherTeam);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberRepository.findById(2L)).thenReturn(Optional.of(memberOfAnotherTeam));

    // Assert
    assertThrows(UserNotInTeamException.class, () -> teamService.resignManager(1L, creator, 2L));
  }

  @Test
  void resignManagerWithReplacementMemberWhoIsAlreadyManagerOfTheTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    creator.setTeam(team);
    team.setManager1(creator);

    Member manager2 = new Member();
    manager2.setIdMember(2L);
    manager2.setTeam(team);
    team.setManager2(manager2);

    team.setMembers(List.of(creator, manager2));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberRepository.findById(2L)).thenReturn(Optional.of(manager2));

    // Assert
    assertThrows(
        MemberAlreadyManagerException.class,
        () -> teamService.resignManager(1L, creator, 2L));
  }

  @Test
  void resignManagerAsManager1WithReplacementMember() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    creator.setTeam(team);
    team.setManager1(creator);

    Member replacement = new Member();
    replacement.setIdMember(2L);
    replacement.setTeam(team);

    when(memberRepository.findById(2L)).thenReturn(Optional.of(replacement));

    team.setMembers(List.of(creator, replacement));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(team)).thenReturn(team);

    // Act
    Team result = teamService.resignManager(1L, creator, 2L);

    // Assert
    assertEquals(replacement, result.getManager1());
  }

  @Test
  void resignManagerAsManager2WithReplacementMember() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    creator.setTeam(team);
    team.setManager2(creator);

    Member manager1 = new Member();
    manager1.setIdMember(3L);
    manager1.setTeam(team);
    team.setManager1(manager1);

    Member replacement = new Member();
    replacement.setIdMember(2L);
    replacement.setTeam(team);

    when(memberRepository.findById(2L)).thenReturn(Optional.of(replacement));

    team.setMembers(List.of(manager1, creator, replacement));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(team)).thenReturn(team);

    // Act
    Team result = teamService.resignManager(1L, creator, 2L);

    // Assert
    assertEquals(replacement, result.getManager2());
  }

  @Test
  void resignManagerAsManager2WithNoReplacement() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);
    creator.setTeam(team);
    team.setManager1(creator);

    Member manager2 = new Member();
    manager2.setIdMember(2L);
    manager2.setTeam(team);
    team.setManager2(manager2);

    team.setMembers(List.of(creator, manager2));

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(team)).thenReturn(team);

    // Act
    Team result = teamService.resignManager(1L, manager2, null);

    // Assert
    assertAll(() -> assertNull(team.getManager2()), () -> assertEquals(team, result));
  }

  @Test
  void resignManagerWithOtherManager() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    Member manager1 = creator;
    Member manager2 = new Member();
    manager2.setIdMember(2L);

    team.setManager1(manager1);
    team.setManager2(manager2);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(teamRepository.save(any())).thenReturn(team);

    // Act
    Team result = teamService.resignManager(1L, manager1, null);

    // Assert
    assertNull(result.getManager1());
  }

  @Test
  void resignManagerWithoutReplacementAndNoOtherManager() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    team.setManager1(creator);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));

    // Act + Assert
    assertThrows(
        ReplacementRequiredException.class,
        () -> teamService.resignManager(1L, creator, null));
  }

  @Test
  void resignManagerWithReplacement() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    Member replacement = new Member();
    replacement.setIdMember(2L);
    replacement.setTeam(team);

    team.setManager1(creator);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberRepository.findById(2L)).thenReturn(Optional.of(replacement));
    when(teamRepository.save(any())).thenReturn(team);

    // Act
    Team result = teamService.resignManager(1L, creator, 2L);

    // Assert
    assertEquals(replacement, result.getManager1());
  }

  @Test
  void resignManagerWithReplacementNotInTeam() {
    // Arrange
    Team team = new Team();
    team.setIdTeam(1L);

    Member replacement = new Member();
    replacement.setIdMember(2L);
    replacement.setTeam(null);

    team.setManager1(creator);

    when(teamRepository.findById(1L)).thenReturn(Optional.of(team));
    when(memberRepository.findById(2L)).thenReturn(Optional.of(replacement));

    // Act + Assert
    assertThrows(UserNotInTeamException.class, () -> teamService.resignManager(1L, creator, 2L));
  }
}
