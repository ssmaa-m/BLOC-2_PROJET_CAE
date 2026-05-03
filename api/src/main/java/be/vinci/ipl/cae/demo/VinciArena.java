package be.vinci.ipl.cae.demo;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


/**
 * Main class of the application.
 */
@SuppressWarnings("PMD.UseUtilityClass")
@SpringBootApplication
@EnableScheduling
public class VinciArena {

  /**
   * Main method of the application.
   *
   * @param args the arguments
   */
  public static void main(String[] args) {
    System.out.println("--- START LOAD .ENV FILE ---");
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    // show all env values
    dotenv.entries().forEach(entry -> {
      if (entry.getKey().startsWith("APP_")) {
        System.out.println("VAR DETECTED : " + entry.getKey() + " = " + entry.getValue());
        // INJECT VAR IN SYSTEM PROPERTY FOR application.properties
        System.setProperty(entry.getKey(), entry.getValue());
      }
    });
    System.out.println("--- END LOAD .ENV FILE ---");
    SpringApplication.run(VinciArena.class, args);
  }

}
