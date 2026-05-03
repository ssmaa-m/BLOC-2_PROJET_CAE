package be.vinci.ipl.cae.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Member entity.
 */
@Entity
@Table(name = "members", uniqueConstraints = {@UniqueConstraint(columnNames = {"tag", "id_team"})})
@Getter
@Setter
@NoArgsConstructor
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @JsonProperty("id")
  private Long idMember;

  @Column(unique = true)
  private String email;

  private String password;

  private String tag;

  @ManyToOne
  @JoinColumn(name = "id_specialty")
  private Specialty specialty;

  @JsonProperty("admin")
  private boolean isAdmin;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "id_team")
  private Team team;

  private LocalDateTime creationDate = LocalDateTime.now();

  @ManyToOne
  @JoinColumn(name = "id_profile_image")
  private ProfileImage profileImage;

  private boolean isDeleted;

  @Override
  public boolean equals(Object o) {
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Member member = (Member) o;
    return Objects.equals(idMember, member.idMember);
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(idMember);
  }

  /**
   * Checks if this member is free given a list of their unavailabilities.
   */
  public boolean isFreeAt(LocalDateTime dateTime, Iterable<Unavailability> unavailabilities) {
    for (Unavailability unavailability : unavailabilities) {
      boolean startsBeforeOrAt = !dateTime.isBefore(unavailability.getStartDate());
      boolean endsAfterOrAt = !dateTime.isAfter(unavailability.getEndDate());

      if (startsBeforeOrAt && endsAfterOrAt) {
        return false;
      }
    }
    return true;
  }
}
