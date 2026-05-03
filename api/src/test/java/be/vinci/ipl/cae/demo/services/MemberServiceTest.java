package be.vinci.ipl.cae.demo.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import be.vinci.ipl.cae.demo.exceptions.CannotBanAdminException;
import be.vinci.ipl.cae.demo.exceptions.CannotBanSelfException;
import be.vinci.ipl.cae.demo.exceptions.MemberAlreadyBannedException;
import be.vinci.ipl.cae.demo.exceptions.MemberNotFoundException;
import be.vinci.ipl.cae.demo.exceptions.NotAdminException;
import be.vinci.ipl.cae.demo.exceptions.NotAuthenticatedException;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.ProfileImageRepository;
import be.vinci.ipl.cae.demo.repositories.SpecialtyRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

  @Mock
  private MemberRepository memberRepository;


  @InjectMocks
  private MemberService memberService;

  @Mock
  private SpecialtyRepository specialtyRepository;

  @Mock
  private ProfileImageRepository profileImageRepository;

  @Mock
  private be.vinci.ipl.cae.demo.repositories.TeamRepository teamRepository;

  @Mock
  private be.vinci.ipl.cae.demo.repositories.MatchLineupRepository matchLineupRepository;

  // ========================= BAN MEMBER =========================

  @Test
  void banMemberWhenRequesterIsAdmin() {

    // Arrange
    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setAdmin(true);

    Member target = new Member();
    target.setIdMember(1L);
    target.setDeleted(false);

    Team team = new Team();
    team.setIdTeam(1L);
    target.setTeam(team);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(1L)).thenReturn(Optional.of(target));

    // Act
    memberService.banMember(1L, "admin@mail.com");

    // Assert
    assertTrue(target.isDeleted());
    assertNull(target.getTeam());
  }

  @Test
  void banMemberWithNonAdminRequester() {

    // Arrange
    Member user = new Member();
    user.setEmail("user@mail.com");
    user.setAdmin(false);

    when(memberRepository.findByEmail("user@mail.com")).thenReturn(user);

    // Act & Assert
    assertThrows(NotAdminException.class, () -> {
      memberService.banMember(1L, "user@mail.com");
    });
  }

  @Test
  void banMemberWithUnknownMember() {

    // Arrange
    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setAdmin(true);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(MemberNotFoundException.class, () -> {
      memberService.banMember(1L, "admin@mail.com");
    });
  }

  @Test
  void banMemberAlreadyBanned() {

    // Arrange
    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setAdmin(true);

    Member target = new Member();
    target.setIdMember(1L);
    target.setDeleted(true);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(1L)).thenReturn(Optional.of(target));

    // Act & Assert
    assertThrows(MemberAlreadyBannedException.class, () -> {
      memberService.banMember(1L, "admin@mail.com");
    });
  }

  @Test
  void banMemberSelfBan() {

    // Arrange
    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setIdMember(1L);
    admin.setAdmin(true);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(1L)).thenReturn(Optional.of(admin));

    // Act & Assert
    assertThrows(CannotBanSelfException.class, () -> {
      memberService.banMember(1L, "admin@mail.com");
    });
  }

  @Test
  void banMemberTargetIsAdmin() {

    // Arrange
    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setAdmin(true);

    Member target = new Member();
    target.setIdMember(1L);
    target.setAdmin(true);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(1L)).thenReturn(Optional.of(target));

    // Act & Assert
    assertThrows(CannotBanAdminException.class, () -> {
      memberService.banMember(1L, "admin@mail.com");
    });
  }

  @Test
  void banMemberRequesterNotFound() {

    // Arrange
    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(null);

    // Act & Assert
    assertThrows(NotAuthenticatedException.class, () -> {
      memberService.banMember(1L, "admin@mail.com");
    });
  }

  @Test
  void banMemberManager1ReplacedByManager2() {

    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setAdmin(true);

    Member manager1 = new Member();
    manager1.setIdMember(1L);

    Member manager2 = new Member();
    manager2.setIdMember(2L);

    Team team = new Team();
    team.setManager1(manager1);
    team.setManager2(manager2);
    team.setMembers(java.util.List.of(manager1, manager2));

    manager1.setTeam(team);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager1));

    memberService.banMember(1L, "admin@mail.com");

    assertEquals(manager2, team.getManager1());
    assertNull(team.getManager2());
  }

  @Test
  void banMemberLastManagerMakesTeamInactive() {

    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setAdmin(true);

    Member manager = new Member();
    manager.setIdMember(1L);

    Team team = new Team();
    team.setManager1(manager);
    team.setMembers(java.util.List.of(manager));

    manager.setTeam(team);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(1L)).thenReturn(Optional.of(manager));

    memberService.banMember(1L, "admin@mail.com");

    assertNull(team.getManager1());
    assertFalse(team.getIsActive());
  }

  @Test
  void banMemberRemovesManager2() {

    Member admin = new Member();
    admin.setEmail("admin@mail.com");
    admin.setAdmin(true);

    Member manager2 = new Member();
    manager2.setIdMember(2L);

    Team team = new Team();
    team.setManager2(manager2);
    team.setMembers(java.util.List.of(manager2));

    manager2.setTeam(team);

    when(memberRepository.findByEmail("admin@mail.com")).thenReturn(admin);
    when(memberRepository.findById(2L)).thenReturn(Optional.of(manager2));

    memberService.banMember(2L, "admin@mail.com");

    assertNull(team.getManager2());
  }

  // ========================= IS LAST MEMBER =========================

  @Test
  void isLastMemberTrue() {

    // Arrange
    Member m = new Member();
    m.setIdMember(1L);

    Team team = new Team();
    team.setMembers(java.util.List.of(m));

    m.setTeam(team);

    when(memberRepository.findById(1L)).thenReturn(Optional.of(m));

    // Act
    boolean result = memberService.isLastMember(1L);

    // Assert
    assertTrue(result);
  }

  @Test
  void isLastMemberFalseWhenMultipleMembers() {

    // Arrange
    Member m1 = new Member();
    m1.setIdMember(1L);

    Member m2 = new Member();
    m2.setIdMember(2L);

    Team team = new Team();
    team.setMembers(java.util.List.of(m1, m2));

    m1.setTeam(team);

    when(memberRepository.findById(1L)).thenReturn(Optional.of(m1));

    // Act
    boolean result = memberService.isLastMember(1L);

    // Assert
    assertFalse(result);
  }

  @Test
  void isLastMemberFalseWhenNoTeam() {

    // Arrange
    Member m = new Member();
    m.setIdMember(1L);

    when(memberRepository.findById(1L)).thenReturn(Optional.of(m));

    // Act
    boolean result = memberService.isLastMember(1L);

    // Assert
    assertFalse(result);
  }

  @Test
  void isLastMemberThrowsWhenMemberNotFound() {

    // Arrange
    when(memberRepository.findById(1L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(MemberNotFoundException.class, () -> {
      memberService.isLastMember(1L);
    });
  }

  @Test
  void isLastMemberIgnoresDeletedMembers() {

    Member m1 = new Member();
    m1.setIdMember(1L);
    m1.setDeleted(false);

    Member m2 = new Member();
    m2.setIdMember(2L);
    m2.setDeleted(true);

    Team team = new Team();
    team.setMembers(java.util.List.of(m1, m2));

    m1.setTeam(team);

    when(memberRepository.findById(1L)).thenReturn(Optional.of(m1));

    boolean result = memberService.isLastMember(1L);

    assertTrue(result);
  }

  @Test
  void isLastMemberFalseWhenMultipleActiveMembers() {

    Member m1 = new Member();
    m1.setIdMember(1L);
    m1.setDeleted(false);

    Member m2 = new Member();
    m2.setIdMember(2L);
    m2.setDeleted(false);

    Team team = new Team();
    team.setMembers(java.util.List.of(m1, m2));

    m1.setTeam(team);

    when(memberRepository.findById(1L)).thenReturn(Optional.of(m1));

    boolean result = memberService.isLastMember(1L);

    assertFalse(result);
  }


}
