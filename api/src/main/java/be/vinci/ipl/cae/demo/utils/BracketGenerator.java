package be.vinci.ipl.cae.demo.utils;

import be.vinci.ipl.cae.demo.models.entities.Match;
import be.vinci.ipl.cae.demo.models.entities.MatchStatus;
import be.vinci.ipl.cae.demo.models.entities.Team;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Utility class for generating brackets.
 */
public final class BracketGenerator {

  /**
   * Utility class constructor.
   */
  private BracketGenerator() {
    throw new IllegalStateException("Utility class");
  }

  /**
   * Generates a full single-elimination bracket.
   *
   * @param teams The list of teams to generate the bracket for
   */
  public static List<Match> generateBracket(List<Team> teams) {
    if (teams.size() < 2) {
      return Collections.emptyList();
    }

    int bracketSize = calculateNextPowerOfTwo(teams.size());
    List<Integer> seeds = generateSeedPattern(bracketSize);

    Team[] startingSlots = assignTeamsToStartingSlots(teams, seeds, bracketSize);
    Match[] matches = initializeEmptyMatches(bracketSize);

    populateRoundOneAndResolveByes(startingSlots, matches, bracketSize);
    linkMatchesToParents(matches, bracketSize);

    return convertArrayToList(matches, bracketSize);
  }

  /**
   * Calculates the next power of two greater than or equal to the given number.
   *
   * @param n The number to calculate the next power of two for
   * @return The next power of two greater than or equal to n
   */
  private static int calculateNextPowerOfTwo(int n) {
    int p = 1;
    while (p < n) {
      p *= 2;
    }
    return p;
  }

  /**
   * Assigns teams to their starting slots based on the seed pattern.
   *
   * @param teams The list of teams to assign
   * @param seeds The seed pattern to use
   * @param bracketSize The size of the bracket
   * @return The starting slots array
   */
  private static Team[] assignTeamsToStartingSlots(
      List<Team> teams,
      List<Integer> seeds,
      int bracketSize) {
    Collections.shuffle(teams);
    Team[] startingSlots = new Team[bracketSize];

    for (int i = 0; i < teams.size(); i++) {
      startingSlots[seeds.get(i)] = teams.get(i);
    }
    return startingSlots;
  }

  /**
   * Initializes an empty matches array with the given bracket size.
   *
   * @param bracketSize The size of the bracket
   * @return The initialized matches array
   */
  private static Match[] initializeEmptyMatches(int bracketSize) {
    Match[] matches = new Match[bracketSize];
    for (int i = 1; i < bracketSize; i++) {
      Match m = new Match();
      // Calculate the round number based on tree depth
      m.setTurn(calculateRoundNumber(bracketSize, i));
      matches[i] = m;
    }
    return matches;
  }

  /**
   * Calculates the round number based on the bracket size and index.
   *
   * @param bracketSize The size of the bracket
   * @param index The index of the match
   * @return The round number
   */
  private static int calculateRoundNumber(int bracketSize, int index) {
    return (int) (Math.log(bracketSize) / Math.log(2)) - (int) (Math.log(index) / Math.log(2));
  }

  /**
   * Populates the round one matches and resolves byes.
   *
   * @param startingSlots The starting slots array
   * @param matches The matches array
   * @param bracketSize The size of the bracket
   */
  private static void populateRoundOneAndResolveByes(
      Team[] startingSlots,
      Match[] matches,
      int bracketSize) {
    int roundOneStartIndex = bracketSize / 2;

    for (int i = roundOneStartIndex; i < bracketSize; i++) {
      int slotIndex = (i - roundOneStartIndex) * 2;
      Team t1 = startingSlots[slotIndex];
      Team t2 = startingSlots[slotIndex + 1];

      Match match = matches[i];
      match.setTeam1(t1);
      match.setTeam2(t2);

      if (t1 == null || t2 == null) {
        advanceTeamToNextRound(match, t1, t2, matches, i);
      }
    }
  }

  /**
   * Advances a team to the next round by setting their status to PLAYED and linking them to their
   * parent match.
   *
   * @param currentMatch The current match to advance
   * @param t1 The winning team
   * @param t2 The losing team
   * @param matches The matches array
   * @param currentIndex The current index in the matches array
   */
  private static void advanceTeamToNextRound(
      Match currentMatch,
      Team t1,
      Team t2,
      Match[] matches,
      int currentIndex) {
    Team winner = (t1 != null) ? t1 : t2;
    currentMatch.setStatus(MatchStatus.PLAYED);

    // The parent match in a binary heap is always at index / 2
    Match parent = matches[currentIndex / 2];

    // If current index is even, it goes to the left slot (team1). If odd, right slot (team2).
    if (currentIndex % 2 == 0) {
      parent.setTeam1(winner);
    } else {
      parent.setTeam2(winner);
    }
  }

  /**
   * Links matches to their parent matches in the bracket.
   *
   * @param matches The matches array
   * @param bracketSize The size of the bracket
   */
  private static void linkMatchesToParents(Match[] matches, int bracketSize) {
    for (int i = 2; i < bracketSize; i++) {
      matches[i].setNextMatch(matches[i / 2]);
    }
  }

  /**
   * Converts the matches array to a list, skipping the first index.
   *
   * @param matches The matches array
   * @param bracketSize The size of the bracket
   * @return The converted list of matches
   */
  private static List<Match> convertArrayToList(Match[] matches, int bracketSize) {
    List<Match> finalList = new ArrayList<>();
    for (int i = 1; i < bracketSize; i++) {
      finalList.add(matches[i]);
    }
    return finalList;
  }

  /**
   * Generates the mathematical folding pattern (0-indexed).
   *
   * @param size The size of the bracket
   * @return The generated seed pattern
   */
  private static List<Integer> generateSeedPattern(int size) {
    List<Integer> seeds = new ArrayList<>();
    seeds.add(0);
    int currentSize = 1;

    while (currentSize < size) {
      List<Integer> nextSeeds = new ArrayList<>();
      for (int seed : seeds) {
        nextSeeds.add(seed);
        // The formula that ensures opposing seeds sum to currentSize * 2 - 1
        nextSeeds.add(currentSize * 2 - 1 - seed);
      }
      seeds = nextSeeds;
      currentSize *= 2;
    }
    return seeds;
  }
}
