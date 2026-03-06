package com.gidy.profile.controller;

import com.gidy.profile.config.WebConfig;
import com.gidy.profile.entity.Profile;
import com.gidy.profile.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final WebConfig webConfig;

    public ProfileController(ProfileRepository profileRepository, WebConfig webConfig) {
        this.profileRepository = profileRepository;
        this.webConfig = webConfig;
    }

    // ── GET all profiles ──────────────────────────────────────────────────────
    @GetMapping
    public List<Profile> getAll() {
        return profileRepository.findAll();
    }

    // ── GET single profile ────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Profile> getById(@PathVariable Long id) {
        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profileOpt.get());
    }

    // ── CREATE profile ────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Profile> create(@RequestBody Profile profile) {
        Profile saved = profileRepository.save(profile);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ── UPDATE profile ────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<Profile> update(@PathVariable Long id,
                                          @RequestBody Profile incoming) {
        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Profile profile = profileOpt.get();
        if (incoming.getName()              != null) profile.setName(incoming.getName());
        if (incoming.getBio()               != null) profile.setBio(incoming.getBio());
        if (incoming.getDesignation()       != null) profile.setDesignation(incoming.getDesignation());
        if (incoming.getLocation()          != null) profile.setLocation(incoming.getLocation());
        if (incoming.getEmail()             != null) profile.setEmail(incoming.getEmail());
        if (incoming.getPhone()             != null) profile.setPhone(incoming.getPhone());
        if (incoming.getCompany()           != null) profile.setCompany(incoming.getCompany());
        if (incoming.getWebsite()           != null) profile.setWebsite(incoming.getWebsite());
        if (incoming.getAvatarUrl()         != null) profile.setAvatarUrl(incoming.getAvatarUrl());
        if (incoming.getResumeUrl()         != null) profile.setResumeUrl(incoming.getResumeUrl());
        if (incoming.getCareerGoals()       != null) profile.setCareerGoals(incoming.getCareerGoals());
        if (incoming.getLeague()            != null) profile.setLeague(incoming.getLeague());
        if (incoming.getRank()              != null) profile.setRank(incoming.getRank());
        if (incoming.getPoints()            != null) profile.setPoints(incoming.getPoints());
        if (incoming.getProfileCompletion() != null) profile.setProfileCompletion(incoming.getProfileCompletion());
        profile.setOpenToWork(incoming.isOpenToWork());
        return ResponseEntity.ok(profileRepository.save(profile));
    }

    // ── UPLOAD photo ──────────────────────────────────────────────────────────
    @PostMapping("/{id}/photo")
    public ResponseEntity<Profile> uploadPhoto(@PathVariable Long id,
                                               @RequestParam("file") MultipartFile file) {
        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            String url = webConfig.saveFile(file, "photos");
            Profile profile = profileOpt.get();
            profile.setAvatarUrl(url);
            return ResponseEntity.ok(profileRepository.save(profile));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── UPLOAD resume ─────────────────────────────────────────────────────────
    @PostMapping("/{id}/resume")
    public ResponseEntity<Profile> uploadResume(@PathVariable Long id,
                                                @RequestParam("file") MultipartFile file) {
        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            String url = webConfig.saveFile(file, "resumes");
            Profile profile = profileOpt.get();
            profile.setResumeUrl(url);
            return ResponseEntity.ok(profileRepository.save(profile));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── AI Bio ────────────────────────────────────────────────────────────────
    @PostMapping("/{id}/ai-bio")
    public ResponseEntity<Profile> generateAiBio(@PathVariable Long id) {
        Optional<Profile> profileOpt = profileRepository.findById(id);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Profile profile = profileOpt.get();
        String name        = profile.getName()        != null ? profile.getName()        : "this developer";
        String designation = profile.getDesignation() != null ? profile.getDesignation() : "professional";
        String location    = profile.getLocation()    != null ? ", based in " + profile.getLocation() : "";
        String company     = profile.getCompany()     != null ? " currently at " + profile.getCompany() + "," : "";

        String bio = String.format(
            "I'm %s, a passionate %s%s%s with a drive to build innovative solutions. " +
            "I thrive on solving challenging problems and continuously improving my craft. " +
            "Always open to learning, collaborating, and creating meaningful impact through technology.",
            name, designation, company, location
        );
        profile.setBio(bio);
        return ResponseEntity.ok(profileRepository.save(profile));
    }

    // ── DELETE profile ────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!profileRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        profileRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
