package be.vinci.ipl.cae.demo.initializers;

import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchLineup;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.ProfileImage;
import be.vinci.ipl.cae.demo.models.entities.Specialty;
import be.vinci.ipl.cae.demo.models.entities.Team;
import be.vinci.ipl.cae.demo.models.entities.Tournament;
import be.vinci.ipl.cae.demo.models.entities.TournamentStatus;
import be.vinci.ipl.cae.demo.repositories.MatchLineupRepository;
import be.vinci.ipl.cae.demo.repositories.MatchRepository;
import be.vinci.ipl.cae.demo.repositories.MemberRepository;
import be.vinci.ipl.cae.demo.repositories.ProfileImageRepository;
import be.vinci.ipl.cae.demo.repositories.SpecialtyRepository;
import be.vinci.ipl.cae.demo.repositories.TeamRepository;
import be.vinci.ipl.cae.demo.repositories.TournamentRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data initializer for dev.
 */
@Component
@Profile("dev")
public class DevDataInitializer implements CommandLineRunner {

  private final MemberRepository memberRepo;
  private final TeamRepository teamRepo;
  private final SpecialtyRepository specRepo;
  private final ProfileImageRepository imageRepo;
  private final TournamentRepository tournamentRepo;
  private final MatchRepository matchRepo;
  private final MatchLineupRepository matchLineupRepo;

  /**
   * Constructor Injection.
   */
  public DevDataInitializer(
      MemberRepository memberRepo,
      TeamRepository teamRepo,
      SpecialtyRepository specRepo,
      ProfileImageRepository imageRepo,
      TournamentRepository tournamentRepo,
      MatchRepository matchRepo,
      MatchLineupRepository matchLineupRepo) {
    this.memberRepo = memberRepo;
    this.teamRepo = teamRepo;
    this.specRepo = specRepo;
    this.imageRepo = imageRepo;
    this.tournamentRepo = tournamentRepo;
    this.matchRepo = matchRepo;
    this.matchLineupRepo = matchLineupRepo;
  }

  /**
   * Create mock data for members.
   */
  @Override
  public void run(String... args) {
    System.out.println("--- STARTING DEV DATA INITIALIZATION ---");

    // Create Specialities
    String[] specialities = {"architecte", "exécuteur", "tacticien", "gardien", "catalyseur",
        "perturbateur", "guérisseur"};

    Map<String, Specialty> specMap = new HashMap<>();
    for (String specialty : specialities) {
      Specialty spec = new Specialty();
      spec.setName(specialty);
      specMap.put(specialty, specRepo.save(spec));
    }

    // Insert profile image paths
    for (int i = 1; i <= 20; i++) {
      ProfileImage image = new ProfileImage();
      image.setPath("profile-" + i + ".png");
      imageRepo.save(image);
    }

    // Define Mock Data Records
    record MemberMockData(String email, String tag, String specialty, String creationDate,
                          boolean isAdmin, boolean isManager, String teamName) {

    }

    record TournamentMockData(String name, String description, String start, String end,
                              String deadline, int capacity, int teamCount, String winnerTeamName,
                              TournamentStatus status) {

    }

    MemberMockData[] memberDataList = {
        new MemberMockData("lea@mail.com", "Lynx", "tacticien", "2025-11-12", true, true,
            "TEAM_ALPHA"),
        new MemberMockData("test@mail.com", "delete_me", "tacticien", "2025-11-12", false, false,
            "TEAM_ALPHA"),
        new MemberMockData("tom@mail.com", "Rogue", "exécuteur", "2025-12-03", false, false,
            "TEAM_ALPHA"),
        new MemberMockData("ines@mail.com", "Pulse", "guérisseur", "2026-01-18", false, false,
            "TEAM_ALPHA"),
        new MemberMockData("tibo@mail.com", "Iron", "gardien", "2025-10-27", true, true,
            "TEAM_OMEGA"),
        new MemberMockData("lisa@mail.com", "Storm", "exécuteur", "2026-01-10", false, true,
            "TEAM_IOTA"),
        new MemberMockData("noa@mail.com", "Flash", "architecte", "2026-02-02", false, true,
            "TEAM_IOTA"),
        new MemberMockData("tim@mail.com", "Titi", "gardien", "2026-02-03", false, false,
            "TEAM_IOTA"),
        new MemberMockData("zoe@mail.com", "Vector", "catalyseur", "2026-02-04", false, false,
            "TEAM_IOTA")};

    String pw = "Password1!";
    String encodedPw = new BCryptPasswordEncoder().encode(pw);
    Map<String, Team> teamMap = new HashMap<>();

    // 4. Create Members and Teams
    for (int i = 0; i < memberDataList.length; i++) {
      MemberMockData data = memberDataList[i];

      Member member = new Member();
      member.setEmail(data.email());
      member.setPassword(encodedPw);
      member.setTag(data.tag());
      member.setCreationDate(LocalDate.parse(data.creationDate()).atStartOfDay());
      member.setAdmin(data.isAdmin());
      member.setDeleted(false);
      member.setSpecialty(specMap.get(data.specialty()));
      member.setProfileImage(imageRepo.getProfileImageByIdImage((long) ((i % 20) + 1)));

      Team team = teamMap.computeIfAbsent(data.teamName(), name -> {
        Team t = new Team();
        t.setName(name);
        t.setIsActive(true);
        return teamRepo.save(t);
      });

      member.setTeam(team);
      member = memberRepo.save(member);

      if (data.isManager()) {
        if (team.getManager1() == null) {
          team.setManager1(member);
        } else if (team.getManager2() == null) {
          team.setManager2(member);
        }
        teamRepo.save(team);
      }
    }

    Map<String, Team> allTeamsMap = new HashMap<>(teamMap);
    for (int i = 1; i <= 15; i++) {
      String name = "TEAM_GHOST_" + i;
      if (!allTeamsMap.containsKey(name)) {
        Team t = new Team();
        t.setName(name);
        t.setIsActive(true);
        allTeamsMap.put(name, teamRepo.save(t));
      }
    }
    List<Team> poolOfTeams = new ArrayList<>(allTeamsMap.values());

    TournamentMockData[] tournamentDataList = {
        // PASSÉS (DONE)
        new TournamentMockData("Spring Arena Cup 2025",
            "Compétition printanière ouverte aux nouvelles teams émergentes", "2025-04-15",
            "2025-04-25", "2025-04-10T20:00:00", 8, 7, "TEAM_OMEGA", TournamentStatus.DONE),
        new TournamentMockData("Elite Championship 2025",
            "Compétition élite réservée aux meilleures teams", "2025-05-15", "2025-05-30",
            "2025-05-11T20:00:00", 8, 6, "TEAM_IOTA", TournamentStatus.DONE),
        new TournamentMockData("Summer Pro League 2025",
            "Tournoi estival de haut niveau avec les meilleures teams", "2025-07-01", "2025-07-15",
            "2025-06-25T20:00:00", 16, 14, "TEAM_IOTA", TournamentStatus.DONE),
        new TournamentMockData("Vinci Winter Clash 2026",
            "Tournoi hivernal réunissant des équipes semi-professionnelles", "2026-01-10",
            "2026-01-20", "2026-01-05T20:00:00", 12, 12, "TEAM_ALPHA", TournamentStatus.DONE),

        new TournamentMockData("Spring Battle Series 2026",
            "Série printanière avec élimination directe", "2026-04-04", "2026-04-11",
            "2026-04-01T20:00:00", 8, 8, null, TournamentStatus.IN_PROGRESS),

        new TournamentMockData("Vinci Easter Cup 2026",
            "Tournoi de Pâques ouvert à toutes les teams actives", "2027-04-15", "2027-04-25",
            "2027-04-08T20:00:00", 8, 7, null, TournamentStatus.REGISTRATION_OPEN),
        new TournamentMockData("Elite Championship 2026",
            "Compétition élite réservée aux meilleures teams", "2026-05-15", "2026-05-30",
            "2026-05-11T20:00:00", 16, 14, null, TournamentStatus.REGISTRATION_OPEN)};

    for (TournamentMockData data : tournamentDataList) {
      Tournament t = new Tournament();
      t.setName(data.name());
      t.setDescription(data.description());
      t.setStartDate(LocalDate.parse(data.start()));
      t.setEndDate(LocalDate.parse(data.end()));
      t.setRegistrationDeadline(LocalDateTime.parse(data.deadline()));
      t.setCapacity(data.capacity());
      t.setStatus(data.status());
      t.setWinner(teamMap.get(data.winnerTeamName));

      // filling registered teams
      List<Team> registered = new ArrayList<>();
      for (int i = 0; i < data.teamCount() && i < poolOfTeams.size(); i++) {
        registered.add(poolOfTeams.get(i));
      }

      // force the presence of winner
      if (data.winnerTeamName() != null) {
        Team winner = teamMap.get(data.winnerTeamName());
        if (winner != null) {
          registered.add(winner);
        }
      }

      t.setTeams(registered);
      tournamentRepo.save(t);
    }

    // create mock matches
    Tournament springBattle = StreamSupport.stream(tournamentRepo.findAll().spliterator(), false)
        .filter(t -> "Spring Battle Series 2026".equals(t.getName())).findFirst().orElse(null);
    Team alpha = teamRepo.findByName("TEAM_ALPHA");
    Team omega = teamRepo.findByName("TEAM_OMEGA");

    // MATCH 1: Alpha vs Omega
    Match match1 = new Match();
    match1.setTournament(springBattle);
    match1.setTeam1(alpha);
    match1.setTeam2(omega);
    match1.setTurn(1);
    match1.setDateHour(LocalDateTime.now().plusDays(2).withHour(14).withMinute(0));
    match1.setStatus(MatchStatus.PLANNED);
    match1 = matchRepo.save(match1);

    Team iota = teamRepo.findByName("TEAM_IOTA");
    Team ghost1 = teamRepo.findByName("TEAM_GHOST_1");
    // MATCH 2: Iota vs Ghost 1
    Match match2 = new Match();
    match2.setTournament(springBattle);
    match2.setTeam1(iota);
    match2.setTeam2(ghost1);
    match2.setTurn(1);
    match2.setDateHour(LocalDateTime.now().plusDays(2).withHour(16).withMinute(30));
    match2.setStatus(MatchStatus.PLANNED);
    match2 = matchRepo.save(match2);
    createEmptyMatchLineup(match1, alpha);
    createEmptyMatchLineup(match1, omega);

    // Match 2 slots
    createEmptyMatchLineup(match2, iota);
    createEmptyMatchLineup(match2, ghost1);

    System.out.println("--- DEV DATA INITIALIZATION COMPLETE ---");
  }

  /**
   * Create an empty match lineup with default values.
   *
   * @param match the match
   * @param team the team
   */
  private void createEmptyMatchLineup(Match match, Team team) {
    MatchLineup lineup = new MatchLineup();
    lineup.setMatch(match);
    lineup.setTeam(team);
    lineup.setMembers(new HashSet<>());
    matchLineupRepo.save(lineup);
  }
}
