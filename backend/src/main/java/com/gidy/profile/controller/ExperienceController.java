package com.gidy.profile.controller;

import com.gidy.profile.entity.Experience;
import com.gidy.profile.entity.Profile;
import com.gidy.profile.repository.ExperienceRepository;
import com.gidy.profile.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles/{profileId}/experiences")
public class ExperienceController {

    private final ExperienceRepository experienceRepository;
    private final ProfileRepository profileRepository;

    public ExperienceController(ExperienceRepository experienceRepository,
                                ProfileRepository profileRepository) {
        this.experienceRepository = experienceRepository;
        this.profileRepository = profileRepository;
    }

    // ── LIST ──────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Experience>> list(@PathVariable Long profileId) {
        if (!profileRepository.existsById(profileId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(experienceRepository.findByProfileId(profileId));
    }

    // ── ADD ───────────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Experience> add(@PathVariable Long profileId,
                                          @RequestBody Experience experience) {
        Optional<Profile> profileOpt = profileRepository.findById(profileId);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        experience.setProfile(profileOpt.get());
        Experience saved = experienceRepository.save(experience);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    @PutMapping("/{expId}")
    public ResponseEntity<Experience> update(@PathVariable Long profileId,
                                             @PathVariable Long expId,
                                             @RequestBody Experience incoming) {
        Optional<Experience> expOpt = experienceRepository.findByIdAndProfileId(expId, profileId);
        if (expOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Experience exp = expOpt.get();
        if (incoming.getCompany()     != null) exp.setCompany(incoming.getCompany());
        if (incoming.getRole()        != null) exp.setRole(incoming.getRole());
        if (incoming.getStartDate()   != null) exp.setStartDate(incoming.getStartDate());
        if (incoming.getDescription() != null) exp.setDescription(incoming.getDescription());
        exp.setEndDate(incoming.getEndDate());
        exp.setCurrent(incoming.isCurrent());
        return ResponseEntity.ok(experienceRepository.save(exp));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{expId}")
    public ResponseEntity<Void> delete(@PathVariable Long profileId,
                                       @PathVariable Long expId) {
        Optional<Experience> expOpt = experienceRepository.findByIdAndProfileId(expId, profileId);
        if (expOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        experienceRepository.delete(expOpt.get());
        return ResponseEntity.noContent().build();
    }
}
