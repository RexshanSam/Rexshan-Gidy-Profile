package com.gidy.profile.controller;

import com.gidy.profile.entity.Education;
import com.gidy.profile.entity.Profile;
import com.gidy.profile.repository.EducationRepository;
import com.gidy.profile.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles/{profileId}/educations")
public class EducationController {

    private final EducationRepository educationRepository;
    private final ProfileRepository profileRepository;

    public EducationController(EducationRepository educationRepository,
                               ProfileRepository profileRepository) {
        this.educationRepository = educationRepository;
        this.profileRepository = profileRepository;
    }

    // ── LIST ──────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Education>> list(@PathVariable Long profileId) {
        if (!profileRepository.existsById(profileId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(educationRepository.findByProfileId(profileId));
    }

    // ── ADD ───────────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Education> add(@PathVariable Long profileId,
                                         @RequestBody Education education) {
        Optional<Profile> profileOpt = profileRepository.findById(profileId);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        education.setProfile(profileOpt.get());
        Education saved = educationRepository.save(education);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    @PutMapping("/{eduId}")
    public ResponseEntity<Education> update(@PathVariable Long profileId,
                                            @PathVariable Long eduId,
                                            @RequestBody Education incoming) {
        Optional<Education> eduOpt = educationRepository.findByIdAndProfileId(eduId, profileId);
        if (eduOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Education edu = eduOpt.get();
        if (incoming.getInstitution() != null) edu.setInstitution(incoming.getInstitution());
        if (incoming.getDegree()      != null) edu.setDegree(incoming.getDegree());
        if (incoming.getField()       != null) edu.setField(incoming.getField());
        if (incoming.getStartYear()   != null) edu.setStartYear(incoming.getStartYear());
        if (incoming.getGrade()       != null) edu.setGrade(incoming.getGrade());
        edu.setEndYear(incoming.getEndYear());
        edu.setCurrent(incoming.isCurrent());
        return ResponseEntity.ok(educationRepository.save(edu));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{eduId}")
    public ResponseEntity<Void> delete(@PathVariable Long profileId,
                                       @PathVariable Long eduId) {
        Optional<Education> eduOpt = educationRepository.findByIdAndProfileId(eduId, profileId);
        if (eduOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        educationRepository.delete(eduOpt.get());
        return ResponseEntity.noContent().build();
    }
}
