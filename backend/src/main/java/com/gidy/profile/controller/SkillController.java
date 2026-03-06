package com.gidy.profile.controller;

import com.gidy.profile.entity.Skill;
import com.gidy.profile.repository.ProfileRepository;
import com.gidy.profile.repository.SkillRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles/{profileId}/skills")
public class SkillController {

    private final SkillRepository skillRepository;
    private final ProfileRepository profileRepository;

    public SkillController(SkillRepository skillRepository,
                           ProfileRepository profileRepository) {
        this.skillRepository = skillRepository;
        this.profileRepository = profileRepository;
    }

    // ── LIST ──────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Skill>> list(@PathVariable Long profileId) {
        if (!profileRepository.existsById(profileId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(skillRepository.findByProfileId(profileId));
    }

    // ── ADD ───────────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Skill> add(@PathVariable Long profileId,
                                     @RequestBody Skill skill) {
        Optional<com.gidy.profile.entity.Profile> profileOpt = profileRepository.findById(profileId);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        skill.setProfile(profileOpt.get());
        if (skill.getCategory() == null || skill.getCategory().isBlank()) {
            skill.setCategory("Other");
        }
        if (skill.getLevel() == null || skill.getLevel().isBlank()) {
            skill.setLevel("Intermediate");
        }
        skill.setEndorsements(0);
        Skill saved = skillRepository.save(skill);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ── ENDORSE ───────────────────────────────────────────────────────────────
    @PostMapping("/{skillId}/endorse")
    public ResponseEntity<Skill> endorse(@PathVariable Long profileId,
                                         @PathVariable Long skillId) {
        Optional<Skill> skillOpt = skillRepository.findByIdAndProfileId(skillId, profileId);
        if (skillOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Skill skill = skillOpt.get();
        skill.setEndorsements(skill.getEndorsements() + 1);
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> delete(@PathVariable Long profileId,
                                       @PathVariable Long skillId) {
        Optional<Skill> skillOpt = skillRepository.findByIdAndProfileId(skillId, profileId);
        if (skillOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        skillRepository.delete(skillOpt.get());
        return ResponseEntity.noContent().build();
    }
}
