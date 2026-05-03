package be.vinci.ipl.cae.demo.repositories;

import be.vinci.ipl.cae.demo.models.entities.Member;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Member Repository.
 */
@Repository
public interface MemberRepository
    extends CrudRepository<Member, Long>, JpaSpecificationExecutor<Member> {

  /**
   * Finds Member by email.
   *
   * @param email = email address
   * @return Member found
   */
  Member findByEmail(String email);

  /**
   * Checks if member exists by email.
   *
   * @param email = email address
   * @return true if member exists , false if not
   */
  Boolean existsByEmail(String email);

  /**
   * Get a list of members by deleted status.
   *
   * @param isDeleted deleted status
   * @return an array of members
   */
  Member[] findAllByIsDeletedOrderByTagAsc(boolean isDeleted);
}
