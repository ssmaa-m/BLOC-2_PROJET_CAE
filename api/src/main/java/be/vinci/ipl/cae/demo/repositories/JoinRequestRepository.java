package be.vinci.ipl.cae.demo.repositories;

import be.vinci.ipl.cae.demo.models.entities.JoinRequest;
import be.vinci.ipl.cae.demo.models.entities.Member;
import be.vinci.ipl.cae.demo.models.entities.RequestStatus;
import be.vinci.ipl.cae.demo.models.entities.Team;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * JoinRequest Repository.
 */
@Repository
public interface JoinRequestRepository extends CrudRepository<JoinRequest, Long> {

  /**
   * Check if a member already has a pending join request for a given team and a given request
   * status.
   *
   * @param member the member
   * @param requestedTeam the requested team
   * @param status the join request status
   * @return true if the member already has a pending join request; false otherwise
   */
  boolean existsByMemberAndRequestedTeamAndStatus(
      Member member,
      Team requestedTeam,
      RequestStatus status);

  /**
   * Find all join requests for a given team and status.
   *
   * @param requestedTeam the requested team
   * @param status the request status
   * @return a list of join requests
   */
  List<JoinRequest> findAllByRequestedTeamAndStatus(Team requestedTeam, RequestStatus status);

  /**
   * Delete all join requests for a given member and status.
   *
   * @param member the member
   * @param status the request status
   */
  @Modifying
  @Transactional
  void deleteAllByMemberAndStatus(Member member, RequestStatus status);
}
