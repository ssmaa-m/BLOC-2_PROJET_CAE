package be.vinci.ipl.cae.demo.initializers;

import be.vinci.ipl.cae.demo.initializers.InitializerUtils.MemberMockData;
import be.vinci.ipl.cae.demo.initializers.InitializerUtils.TournamentMockData;
import be.vinci.ipl.cae.demo.models.entities.ConfirmationStatus;
import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.StreamSupport;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data initializer for dev.
 */
@Component
@Profile("demo")
public class DemoDataInitializer implements CommandLineRunner {

  private final MemberRepository memberRepo;
  private final TeamRepository teamRepo;
  private final SpecialtyRepository specRepo;
  private final ProfileImageRepository imageRepo;
  private final TournamentRepository tournamentRepo;
  private final MatchRepository matchRepo;
  private final MatchLineupRepository matchLineupRepo;

  /**
   * Demo data Initializer constructor.
   *
   * @param memberRepo member repository.
   * @param teamRepo team repository
   * @param specRepo specialty repository
   * @param imageRepo image repository
   * @param tournamentRepo tournament repository
   * @param matchRepo match repository
   * @param matchLineupRepo matchlineup repository
   */
  public DemoDataInitializer(
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

  @Override
  public void run(String... args) {
    System.out.println("--- STARTING DEMO DATA INITIALIZATION ---");

    // Create Specialities
    Map<String, Specialty> specMap = InitializerUtils.initializeBasics(specRepo, imageRepo);

    MemberMockData[] memberDataList = {
        new MemberMockData(
            "lea@mail.com",
            "Lynx",
            "tacticien",
            "2025-11-12",
            true,
            true,
            "TEAM_ALPHA"),
        new MemberMockData(
            "tom@mail.com",
            "Rogue",
            "exécuteur",
            "2025-12-03",
            false,
            false,
            "TEAM_ALPHA"),
        new MemberMockData(
            "ines@mail.com",
            "Pulse",
            "guérisseur",
            "2026-01-18",
            false,
            false,
            "TEAM_ALPHA"),
        new MemberMockData(
            "pol@mail.com",
            "Wolf",
            "architecte",
            "2026-02-02",
            false,
            false,
            "TEAM_ALPHA"),
        new MemberMockData(
            "tibo@mail.com",
            "Iron",
            "gardien",
            "2025-10-27",
            true,
            true,
            "TEAM_OMEGA"),
        new MemberMockData(
            "neo@mail.com",
            "Shade",
            "catalyseur",
            "2025-10-30",
            false,
            false,
            "TEAM_OMEGA"),
        new MemberMockData(
            "lisa@mail.com",
            "Storm",
            "exécuteur",
            "2026-01-10",
            false,
            true,
            "TEAM_IOTA"),
        new MemberMockData(
            "noa@mail.com",
            "Flash",
            "architecte",
            "2026-02-02",
            false,
            true,
            "TEAM_IOTA"),
        new MemberMockData(
            "tim@mail.com",
            "Titi",
            "gardien",
            "2026-02-03",
            false,
            false,
            "TEAM_IOTA"),
        new MemberMockData(
            "zoe@mail.com",
            "Vector",
            "catalyseur",
            "2026-02-04",
            false,
            false,
            "TEAM_IOTA"),
        new MemberMockData(
            "max@mail.com",
            "Iron",
            "gardien",
            "2026-03-12",
            false,
            true,
            "TEAM_DELTA"),
        new MemberMockData(
            "ali@mail.com",
            "Putsh",
            "perturbateur",
            "2026-01-22",
            false,
            false,
            "TEAM_DELTA"),
        new MemberMockData(
            "zed@mail.com",
            "Zero",
            "architecte",
            "2025-12-11",
            true,
            false,
            "TEAM_DELTA"),
        new MemberMockData(
            "seb@mail.com",
            "Ice",
            "guérisseur",
            "2026-03-01",
            true,
            true,
            "TEAM_DELTA"),
        new MemberMockData(
            "oli@mail.com",
            "Tiger",
            "tacticien",
            "2025-11-11",
            false,
            false,
            "TEAM_DELTA"),
        new MemberMockData(
            "fin@mail.com",
            "Final",
            "exécuteur",
            "2025-10-22",
            false,
            false,
            "TEAM_DELTA")};

    MemberMockData[] fillerTeamMembers = {// TEAM: Primus Squad (Team 1)
        new MemberMockData(
            "p1@mail.com",
            "Uno",
            "exécuteur",
            "2025-10-01",
            false,
            true,
            "Primus Squad"),
        new MemberMockData(
            "p2@mail.com",
            "Alpha-One",
            "tacticien",
            "2025-10-01",
            false,
            false,
            "Primus Squad"),
        new MemberMockData(
            "p3@mail.com",
            "Lead-1",
            "guérisseur",
            "2025-10-01",
            false,
            false,
            "Primus Squad"),
        new MemberMockData(
            "p4@mail.com",
            "First-Step",
            "gardien",
            "2025-10-01",
            false,
            false,
            "Primus Squad"),

        // TEAM: Secundus Force (Team 2)
        new MemberMockData(
            "s1@mail.com",
            "Duo",
            "exécuteur",
            "2025-10-01",
            false,
            true,
            "Secundus Force"),
        new MemberMockData(
            "s2@mail.com",
            "Dual-Core",
            "architecte",
            "2025-10-01",
            false,
            false,
            "Secundus Force"),
        new MemberMockData(
            "s3@mail.com",
            "Binary",
            "tacticien",
            "2025-10-01",
            false,
            false,
            "Secundus Force"),
        new MemberMockData(
            "s4@mail.com",
            "Second-Strike",
            "catalyseur",
            "2025-10-01",
            false,
            false,
            "Secundus Force"),

        // TEAM: Tertius Alliance (Team 3)
        new MemberMockData(
            "t1@mail.com",
            "Trio",
            "perturbateur",
            "2025-10-01",
            false,
            true,
            "Tertius Alliance"),
        new MemberMockData(
            "t2@mail.com",
            "Trident",
            "exécuteur",
            "2025-10-01",
            false,
            false,
            "Tertius Alliance"),
        new MemberMockData(
            "t3@mail.com",
            "Triple-Threat",
            "gardien",
            "2025-10-01",
            false,
            false,
            "Tertius Alliance"),
        new MemberMockData(
            "t4@mail.com",
            "Triangle",
            "tacticien",
            "2025-10-01",
            false,
            false,
            "Tertius Alliance"),

        // TEAM: Quartus Legion (Team 4)
        new MemberMockData(
            "q1@mail.com",
            "Quad",
            "guérisseur",
            "2025-10-01",
            false,
            true,
            "Quartus Legion"),
        new MemberMockData(
            "q2@mail.com",
            "Quartal",
            "exécuteur",
            "2025-10-01",
            false,
            false,
            "Quartus Legion"),
        new MemberMockData(
            "q3@mail.com",
            "Four-Pack",
            "architecte",
            "2025-10-01",
            false,
            false,
            "Quartus Legion"),
        new MemberMockData(
            "q4@mail.com",
            "Tetra",
            "catalyseur",
            "2025-10-01",
            false,
            false,
            "Quartus Legion"),

        // TEAM: Quintus Elite (Team 5)
        new MemberMockData(
            "qi1@mail.com",
            "Penta",
            "perturbateur",
            "2025-10-01",
            false,
            true,
            "Quintus Elite"),
        new MemberMockData(
            "qi2@mail.com",
            "Fifth-Element",
            "exécuteur",
            "2025-10-01",
            false,
            false,
            "Quintus Elite"),
        new MemberMockData(
            "qi3@mail.com",
            "Quinary",
            "tacticien",
            "2025-10-01",
            false,
            false,
            "Quintus Elite"),
        new MemberMockData(
            "qi4@mail.com",
            "V-Star",
            "gardien",
            "2025-10-01",
            false,
            false,
            "Quintus Elite"),

        // TEAM: Sextus Division (Team 6)
        new MemberMockData(
            "sx1@mail.com",
            "Hex",
            "exécuteur",
            "2025-10-01",
            false,
            true,
            "Sextus Division"),
        new MemberMockData(
            "sx2@mail.com",
            "Sixer",
            "guérisseur",
            "2025-10-01",
            false,
            false,
            "Sextus Division"),
        new MemberMockData(
            "sx3@mail.com",
            "Sixtus",
            "architecte",
            "2025-10-01",
            false,
            false,
            "Sextus Division"),
        new MemberMockData(
            "sx4@mail.com",
            "Half-Dozen",
            "catalyseur",
            "2025-10-01",
            false,
            false,
            "Sextus Division"),

        // TEAM: Septimus Guard (Team 7)
        new MemberMockData(
            "se1@mail.com",
            "Seven",
            "tacticien",
            "2025-10-01",
            false,
            true,
            "Septimus Guard"),
        new MemberMockData(
            "se2@mail.com",
            "Heptagon",
            "exécuteur",
            "2025-10-01",
            false,
            false,
            "Septimus Guard"),
        new MemberMockData(
            "se3@mail.com",
            "Lucky-7",
            "gardien",
            "2025-10-01",
            false,
            false,
            "Septimus Guard"),
        new MemberMockData(
            "se4@mail.com",
            "Septum",
            "perturbateur",
            "2025-10-01",
            false,
            false,
            "Septimus Guard"),

        // TEAM: Octavus Clan (Team 8)
        new MemberMockData(
            "o1@mail.com",
            "Octo",
            "exécuteur",
            "2025-10-01",
            false,
            true,
            "Octavus Clan"),
        new MemberMockData(
            "o2@mail.com",
            "Eight-Ball",
            "guérisseur",
            "2025-10-01",
            false,
            false,
            "Octavus Clan"),
        new MemberMockData(
            "o3@mail.com",
            "Octane",
            "tacticien",
            "2025-10-01",
            false,
            false,
            "Octavus Clan"),
        new MemberMockData(
            "o4@mail.com",
            "Octopus",
            "architecte",
            "2025-10-01",
            false,
            false,
            "Octavus Clan"),

        // TEAM: Nonus Phalanx (Team 9)
        new MemberMockData(
            "n1@mail.com",
            "Niner",
            "exécuteur",
            "2025-10-01",
            false,
            true,
            "Nonus Phalanx"),
        new MemberMockData(
            "n2@mail.com",
            "Cloud-9",
            "catalyseur",
            "2025-10-01",
            false,
            false,
            "Nonus Phalanx"),
        new MemberMockData(
            "n3@mail.com",
            "Nova",
            "gardien",
            "2025-10-01",
            false,
            false,
            "Nonus Phalanx"),
        new MemberMockData(
            "n4@mail.com",
            "Nonary",
            "tacticien",
            "2025-10-01",
            false,
            false,
            "Nonus Phalanx"),

        // TEAM: Decimus Prime (Team 10)
        new MemberMockData(
            "d1@mail.com",
            "Deca",
            "perturbateur",
            "2025-10-01",
            false,
            true,
            "Decimus Prime"),
        new MemberMockData(
            "d2@mail.com",
            "Ten-Fold",
            "exécuteur",
            "2025-10-01",
            false,
            false,
            "Decimus Prime"),
        new MemberMockData(
            "d3@mail.com",
            "Metric",
            "guérisseur",
            "2025-10-01",
            false,
            false,
            "Decimus Prime"),
        new MemberMockData(
            "d4@mail.com",
            "Titan-X",
            "gardien",
            "2025-10-01",
            false,
            false,
            "Decimus Prime")};

    String pw = "Password1!";
    String encodedPw = new BCryptPasswordEncoder().encode(pw);
    Map<String, Team> teamMap = new HashMap<>();

    InitializerUtils
        .createMembers(
            memberDataList,
            encodedPw,
            specMap,
            teamMap,
            memberRepo,
            teamRepo,
            imageRepo);

    List<Team> fillerTeams = InitializerUtils
        .createMembers(
            fillerTeamMembers,
            encodedPw,
            specMap,
            teamMap,
            memberRepo,
            teamRepo,
            imageRepo);

    TournamentMockData[] tournamentDataList = {
        // PASSÉS (DONE)
        new TournamentMockData(
            "Spring Arena Cup 2025",
            "Compétition printanière ouverte aux nouvelles teams émergentes",
            "2025-04-15",
            "2025-04-25",
            "2025-04-10T20:00:00",
            8,
            7,
            "TEAM_OMEGA",
            TournamentStatus.DONE),
        new TournamentMockData(
            "Elite Championship 2025",
            "Compétition élite réservée aux meilleures teams",
            "2025-05-15",
            "2025-05-30",
            "2025-05-11T20:00:00",
            8,
            6,
            "TEAM_IOTA",
            TournamentStatus.DONE),
        new TournamentMockData(
            "Summer Pro League 2025",
            "Tournoi estival de haut niveau avec les meilleures teams",
            "2025-07-01",
            "2025-07-15",
            "2025-06-25T20:00:00",
            16,
            14,
            "TEAM_ALPHA",
            TournamentStatus.DONE),
        new TournamentMockData(
            "Vinci Winter Clash 2026",
            "Tournoi hivernal réunissant des équipes semi-professionnelles",
            "2026-01-10",
            "2026-01-20",
            "2026-01-05T20:00:00",
            12,
            12,
            "TEAM_DELTA",
            TournamentStatus.DONE),

        new TournamentMockData(
            "Vinci Easter Cup 2026",
            "Tournoi de Pâques ouvert à toutes les teams actives",
            "2026-04-15",
            "2026-04-25",
            "2026-04-08T20:00:00",
            8,
            7,
            "TEAM_DELTA",
            TournamentStatus.DONE),

        new TournamentMockData(
            "Spring Battle Series 2026",
            "Série printanière avec élimination directe et forte participation",
            "2026-05-04",
            "2026-05-12",
            "2026-05-01T23:59:59",
            8,
            8,
            null,
            TournamentStatus.IN_PROGRESS)};

    TournamentMockData futureTournamentMock = new TournamentMockData(
        "Elite Championship 2026",
        "Compétition élite réservée aux meilleures teams",
        "2026-05-15",
        "2026-05-30",
        "2026-05-11T20:00:00",
        10,
        9,
        null,
        TournamentStatus.REGISTRATION_OPEN);

    for (TournamentMockData data : tournamentDataList) {
      Tournament t = new Tournament();
      t.setName(data.name());
      t.setDescription(data.description());
      t.setStartDate(LocalDate.parse(data.start()));
      t.setEndDate(LocalDate.parse(data.end()));
      t.setRegistrationDeadline(LocalDateTime.parse(data.deadline()));
      t.setCapacity(data.capacity());
      t.setStatus(data.status());
      t.setWinner(teamMap.get(data.winnerTeamName()));
      t.getTeams().add(teamMap.get("TEAM_ALPHA"));
      t.getTeams().add(teamMap.get("TEAM_DELTA"));
      t.getTeams().add(teamMap.get("TEAM_IOTA"));
      t.getTeams().add(teamMap.get("TEAM_OMEGA"));
      InitializerUtils
          .completeTournamentRegistration(t, fillerTeams, data.teamCount(), tournamentRepo);

    }

    Tournament futureTournament = new Tournament();
    futureTournament.setName(futureTournamentMock.name());
    futureTournament.setDescription(futureTournamentMock.description());
    futureTournament.setStartDate(LocalDate.parse(futureTournamentMock.start()));
    futureTournament.setEndDate(LocalDate.parse(futureTournamentMock.end()));
    futureTournament.setRegistrationDeadline(LocalDateTime.parse(futureTournamentMock.deadline()));
    futureTournament.setCapacity(futureTournamentMock.capacity());
    futureTournament.setStatus(futureTournamentMock.status());
    futureTournament.setWinner(teamMap.get(futureTournamentMock.winnerTeamName()));
    futureTournament.getTeams().add(teamMap.get("TEAM_ALPHA"));
    futureTournament.getTeams().add(teamMap.get("TEAM_IOTA"));
    InitializerUtils
        .completeTournamentRegistration(
            futureTournament,
            fillerTeams,
            futureTournamentMock.teamCount(),
            tournamentRepo);

    // Set up matches for current tournament : SPRING BATTLE SERIES 2026
    Tournament springBattle = StreamSupport
        .stream(tournamentRepo.findAll().spliterator(), false)
        .filter(t -> "Spring Battle Series 2026".equals(t.getName()))
        .findFirst()
        .orElse(null);

    // 1. Create the FINAL (nextMatch is null)
    Match finalMatch = InitializerUtils
        .createOneMatch(
            springBattle,
            null,
            null,
            3,
            null,
            LocalDateTime.of(2026, 5, 10, 20, 0),
            MatchStatus.PLANNED,
            matchRepo,
            matchLineupRepo);

    Team delta = teamRepo.findByName("TEAM_DELTA");
    Team iota = teamRepo.findByName("TEAM_IOTA");
    Match deltaVsIota = InitializerUtils
        .createOneMatch(
            springBattle,
            delta,
            iota,
            2,
            finalMatch,
            LocalDateTime.of(2026, 5, 7, 6, 30),
            MatchStatus.PLANNED,
            matchRepo,
            matchLineupRepo);

    Team fillerTeam1 = teamRepo.findByName("Primus Squad");
    Match f1VsIota = InitializerUtils
        .createOneMatch(
            springBattle,
            fillerTeam1,
            iota,
            1,
            deltaVsIota,
            LocalDateTime.of(2026, 5, 5, 16, 45),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(f1VsIota, iota).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lisa@mail.com"),
                      memberRepo.findByEmail("noa@mail.com"),
                      memberRepo.findByEmail("tim@mail.com"),
                      memberRepo.findByEmail("zoe@mail.com")));
      lineup.setScore(4);
      lineup.setWinner(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });
    InitializerUtils.setFillerLineup(f1VsIota, fillerTeam1, matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(f1VsIota, fillerTeam1).ifPresent(lineup -> {
      lineup.setScore(0);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    Team fillerTeam2 = teamRepo.findByName("Secundus Force");
    Match f2vsdelta = InitializerUtils
        .createOneMatch(
            springBattle,
            fillerTeam2,
            delta,
            1,
            deltaVsIota,
            LocalDateTime.of(2026, 5, 5, 19, 0),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(f2vsdelta, delta).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("zed@mail.com"),
                      memberRepo.findByEmail("ali@mail.com"),
                      memberRepo.findByEmail("fin@mail.com"),
                      memberRepo.findByEmail("max@mail.com")));
      lineup.setScore(5);
      lineup.setWinner(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    matchLineupRepo.findByMatchAndTeam(f2vsdelta, fillerTeam2).ifPresent(lineup -> {
      lineup.setScore(2);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    Team alpha = teamRepo.findByName("TEAM_ALPHA");
    Team omega = teamRepo.findByName("TEAM_OMEGA");
    Match omegaVsAlpha = InitializerUtils
        .createOneMatch(
            springBattle,
            omega,
            alpha,
            2,
            finalMatch,
            LocalDateTime.of(2026, 5, 7, 23, 30),
            MatchStatus.PLANNED,
            matchRepo,
            matchLineupRepo);

    Team fillerTeam3 = teamRepo.findByName("Tertius Alliance");
    Match f3vsalpha = InitializerUtils
        .createOneMatch(
            springBattle,
            fillerTeam3,
            alpha,
            1,
            omegaVsAlpha,
            LocalDateTime.of(2026, 5, 5, 20, 30),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    // saving the lineup composition and score
    matchLineupRepo.findByMatchAndTeam(f3vsalpha, alpha).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lea@mail.com"),
                      memberRepo.findByEmail("tom@mail.com"),
                      memberRepo.findByEmail("ines@mail.com"),
                      memberRepo.findByEmail("pol@mail.com")));
      lineup.setScore(5);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      lineup.setWinner(true);
      matchLineupRepo.save(lineup);
    });
    InitializerUtils.setFillerLineup(f3vsalpha, fillerTeam3, matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(f3vsalpha, fillerTeam3).ifPresent(lineup -> {
      lineup.setScore(3);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    Team fillerTeam4 = teamRepo.findByName("Quartus Legion");
    Match f4vsomega = InitializerUtils
        .createOneMatch(
            springBattle,
            fillerTeam4,
            omega,
            1,
            omegaVsAlpha,
            LocalDateTime.of(2026, 5, 5, 20, 15),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    // saving the lineup composition and score
    matchLineupRepo.findByMatchAndTeam(f4vsomega, omega).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("tibo@mail.com"),
                      memberRepo.findByEmail("noa@mail.com")));
      lineup.setScore(5);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      lineup.setWinner(true);
      matchLineupRepo.save(lineup);
    });
    InitializerUtils.setFillerLineup(f4vsomega, fillerTeam4, matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(f4vsomega, fillerTeam4).ifPresent(lineup -> {
      lineup.setScore(0);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    // set up match history for tibo@mail.com
    Tournament eliteChamp25 = StreamSupport
        .stream(tournamentRepo.findAll().spliterator(), false)
        .filter(t -> "Elite Championship 2025".equals(t.getName()))
        .findFirst()
        .orElse(null);

    Match tiboMatch2 = InitializerUtils
        .createOneMatch(
            eliteChamp25,
            omega,
            iota,
            2,
            null,
            LocalDateTime.of(2025, 5, 15, 20, 4),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(tiboMatch2, omega).ifPresent(lineup -> {
      lineup.replaceLineup(Set.of(memberRepo.findByEmail("tibo@mail.com")));
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      lineup.setScore(3);
      matchLineupRepo.save(lineup);
    });
    matchLineupRepo.findByMatchAndTeam(tiboMatch2, iota).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lisa@mail.com"),
                      memberRepo.findByEmail("noa@mail.com"),
                      memberRepo.findByEmail("tim@mail.com"),
                      memberRepo.findByEmail("zoe@mail.com")));
      lineup.setScore(5);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      lineup.setWinner(true);
      matchLineupRepo.save(lineup);
    });

    Tournament springArena25 = StreamSupport
        .stream(tournamentRepo.findAll().spliterator(), false)
        .filter(t -> "Spring Arena Cup 2025".equals(t.getName()))
        .findFirst()
        .orElse(null);

    Match tiboMatch3 = InitializerUtils
        .createOneMatch(
            springArena25,
            omega,
            fillerTeam1,
            2,
            null,
            LocalDateTime.of(2025, 4, 16, 16, 50),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(tiboMatch3, omega).ifPresent(lineup -> {
      lineup.replaceLineup(Set.of(memberRepo.findByEmail("tibo@mail.com")));
      lineup.setScore(5);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      lineup.setWinner(true);
      matchLineupRepo.save(lineup);
    });
    InitializerUtils.setFillerLineup(tiboMatch3, fillerTeam1, matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(tiboMatch3, fillerTeam1).ifPresent(lineup -> {
      lineup.setHasForfeited(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    Tournament summerPro25 = StreamSupport
        .stream(tournamentRepo.findAll().spliterator(), false)
        .filter(t -> "Summer Pro League 2025".equals(t.getName()))
        .findFirst()
        .orElse(null);
    Match tiboMatch4 = InitializerUtils
        .createOneMatch(
            summerPro25,
            omega,
            alpha,
            2,
            null,
            LocalDateTime.of(2025, 7, 2, 19, 15),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(tiboMatch4, omega).ifPresent(lineup -> {
      lineup.replaceLineup(Set.of(memberRepo.findByEmail("tibo@mail.com")));
      lineup.setScore(2);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    matchLineupRepo.findByMatchAndTeam(tiboMatch4, alpha).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lea@mail.com"),
                      memberRepo.findByEmail("tom@mail.com"),
                      memberRepo.findByEmail("ines@mail.com"),
                      memberRepo.findByEmail("pol@mail.com")));
      lineup.setWinner(true);
      lineup.setScore(4);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    // -- create rest of the final matches to be able to display the winner to tournaments
    Tournament winterClash26 = StreamSupport
        .stream(tournamentRepo.findAll().spliterator(), false)
        .filter(t -> "Vinci Winter Clash 2026".equals(t.getName()))
        .findFirst()
        .orElse(null);
    Match wintClashFinal = InitializerUtils
        .createOneMatch(
            winterClash26,
            iota,
            delta,
            3,
            null,
            LocalDateTime.of(2026, 1, 19, 20, 30),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(wintClashFinal, iota).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lisa@mail.com"),
                      memberRepo.findByEmail("noa@mail.com"),
                      memberRepo.findByEmail("tim@mail.com"),
                      memberRepo.findByEmail("zoe@mail.com")));
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      lineup.setHasForfeited(true);
      matchLineupRepo.save(lineup);
    });
    matchLineupRepo.findByMatchAndTeam(wintClashFinal, delta).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("oli@mail.com"),
                      memberRepo.findByEmail("ali@mail.com"),
                      memberRepo.findByEmail("fin@mail.com"),
                      memberRepo.findByEmail("seb@mail.com")));
      lineup.setScore(5);
      lineup.setWinner(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    Tournament easterCup26 = StreamSupport
        .stream(tournamentRepo.findAll().spliterator(), false)
        .filter(t -> "Vinci Easter Cup 2026".equals(t.getName()))
        .findFirst()
        .orElse(null);
    Match easterCupFinal = InitializerUtils
        .createOneMatch(
            easterCup26,
            delta,
            alpha,
            3,
            null,
            LocalDateTime.of(2026, 4, 20, 12, 0),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupFinal, delta).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("max@mail.com"),
                      memberRepo.findByEmail("ali@mail.com"),
                      memberRepo.findByEmail("zed@mail.com"),
                      memberRepo.findByEmail("seb@mail.com")));
      lineup.setScore(2);
      lineup.setWinner(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });
    matchLineupRepo.findByMatchAndTeam(easterCupFinal, alpha).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lea@mail.com"),
                      memberRepo.findByEmail("tom@mail.com"),
                      memberRepo.findByEmail("ines@mail.com"),
                      memberRepo.findByEmail("pol@mail.com")));
      lineup.setScore(1);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    // fill Vinci Easter Cup 2026 entirely
    // --- VINCI EASTER CUP 2026 ---

    // 1. FINAL
    // 2. SEMI-FINALS
    Match easterCupSemi1 = InitializerUtils
        .createOneMatch(
            easterCup26,
            delta,
            fillerTeam2,
            2,
            easterCupFinal,
            LocalDateTime.of(2026, 4, 17, 18, 0),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupSemi1, delta).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("oli@mail.com"),
                      memberRepo.findByEmail("ali@mail.com"),
                      memberRepo.findByEmail("max@mail.com"),
                      memberRepo.findByEmail("fin@mail.com")));
      lineup.setScore(5);
      lineup.setWinner(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    matchLineupRepo.findByMatchAndTeam(easterCupSemi1, fillerTeam2).ifPresent(lineup -> {
      lineup.setHasForfeited(true);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    Match easterCupSemi2 = InitializerUtils
        .createOneMatch(
            easterCup26,
            alpha,
            iota,
            2,
            easterCupFinal,
            LocalDateTime.of(2026, 4, 17, 12, 15),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupSemi2, alpha).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lea@mail.com"),
                      memberRepo.findByEmail("tom@mail.com"),
                      memberRepo.findByEmail("ines@mail.com"),
                      memberRepo.findByEmail("pol@mail.com")));
      lineup.setWinner(true);
      lineup.setScore(2);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });
    matchLineupRepo.findByMatchAndTeam(easterCupSemi2, iota).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lisa@mail.com"),
                      memberRepo.findByEmail("noa@mail.com"),
                      memberRepo.findByEmail("tim@mail.com"),
                      memberRepo.findByEmail("zoe@mail.com")));
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      lineup.setScore(1);
      matchLineupRepo.save(lineup);
    });

    // 3. QUARTER-FINALS
    // QF1
    Match easterCupQf1 = InitializerUtils
        .createOneMatch(
            easterCup26,
            delta,
            fillerTeam3,
            1,
            easterCupSemi1,
            LocalDateTime.of(2026, 4, 16, 10, 0),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupQf1, delta).ifPresent(l -> {
      l
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("max@mail.com"),
                      memberRepo.findByEmail("ali@mail.com"),
                      memberRepo.findByEmail("seb@mail.com"),
                      memberRepo.findByEmail("zed@mail.com")));
      l.setScore(5);
      l.setWinner(true);
      l.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(l);
    });
    InitializerUtils.setFillerLineup(easterCupQf1, fillerTeam3, matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupQf1, fillerTeam3).ifPresent(l -> {
      l.setScore(2);
      l.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(l);
    });

    // QF2
    Match easterCupQf2 = InitializerUtils
        .createOneMatch(
            easterCup26,
            fillerTeam1,
            fillerTeam2,
            1,
            easterCupSemi1,
            LocalDateTime.of(2026, 4, 16, 14, 45),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    InitializerUtils.setFillerLineup(easterCupQf2, fillerTeam2, matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupQf2, fillerTeam2).ifPresent(l -> {
      l.setScore(3);
      l.setWinner(true);
      l.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(l);
    });
    InitializerUtils.setFillerLineup(easterCupQf2, fillerTeam1, matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupQf2, fillerTeam1).ifPresent(l -> {
      l.setScore(2);
      l.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(l);
    });

    // QF3
    Match easterCupQf3 = InitializerUtils
        .createOneMatch(
            easterCup26,
            alpha,
            omega,
            1,
            easterCupSemi2,
            LocalDateTime.of(2026, 4, 16, 16, 0),
            MatchStatus.PLAYED,
            matchRepo,
            matchLineupRepo);
    matchLineupRepo.findByMatchAndTeam(easterCupQf3, alpha).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("lea@mail.com"),
                      memberRepo.findByEmail("tom@mail.com"),
                      memberRepo.findByEmail("ines@mail.com"),
                      memberRepo.findByEmail("pol@mail.com")));
      lineup.setWinner(true);
      lineup.setScore(4);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });
    matchLineupRepo.findByMatchAndTeam(easterCupQf3, omega).ifPresent(lineup -> {
      lineup
          .replaceLineup(
              Set
                  .of(
                      memberRepo.findByEmail("neo@mail.com"),
                      memberRepo.findByEmail("tibo@mail.com")));
      lineup.setScore(2);
      lineup.setConfirmationStatus(ConfirmationStatus.ADMIN_LOCKED);
      matchLineupRepo.save(lineup);
    });

    System.out.println("--- DEMO DATA INITIALIZATION COMPLETE ---");
  }

}
