package be.vinci.ipl.cae.demo.models.dtos;

import be.vinci.ipl.cae.demo.models.entities.Member;
import lombok.Builder;
import lombok.Data;

/**
 * A lightweight member DTO exposed to any authenticated user. Contains only tag, specialty and
 * profile image — no sensitive data like email.
 */
@Data
@Builder
public class MemberSummaryDto {
  private Long id;
  private String tag;
  private String avatar;
  private String specialty;

  /**
   * Converts a Member entity to a MemberSummaryDto. * @param member the entity to convert
   *
   * @return the mapped DTO
   */
  public static MemberSummaryDto fromEntity(Member member) {
    return MemberSummaryDto
        .builder()
        .id(member.getIdMember())
        .tag(member.getTag())
        .avatar(member.getProfileImage().getPath())
        .specialty(member.getSpecialty() != null ? member.getSpecialty().getName() : null)
        .build();
  }
}
