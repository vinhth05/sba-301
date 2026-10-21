package com.fpt.sba301.security.service;

import com.fpt.sba301.security.dto.OrchidRequest;
import com.fpt.sba301.security.dto.OrchidResponse;
import com.fpt.sba301.security.entity.Orchid;
import com.fpt.sba301.security.repository.OrchidRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrchidService {

    private final OrchidRepository orchidRepository;

    public OrchidService(OrchidRepository orchidRepository) {
        this.orchidRepository = orchidRepository;
    }

    public List<OrchidResponse> findAll() {
        return orchidRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrchidResponse findById(Long id) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found with ID: " + id));
        return mapToResponse(orchid);
    }

    @Transactional
    public OrchidResponse create(OrchidRequest request) {
        Orchid orchid = new Orchid();
        orchid.setOrchidName(request.orchidName());
        orchid.setIsNatural(request.isNatural() != null ? request.isNatural() : true);
        orchid.setOrchidDescription(request.orchidDescription());
        orchid.setIsAttractive(request.isAttractive() != null ? request.isAttractive() : true);
        orchid.setOrchidURL(request.orchidURL());

        Orchid saved = orchidRepository.save(orchid);
        return mapToResponse(saved);
    }

    @Transactional
    public OrchidResponse update(Long id, OrchidRequest request) {
        Orchid orchid = orchidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found with ID: " + id));

        orchid.setOrchidName(request.orchidName());
        if (request.isNatural() != null) orchid.setIsNatural(request.isNatural());
        if (request.orchidDescription() != null) orchid.setOrchidDescription(request.orchidDescription());
        if (request.isAttractive() != null) orchid.setIsAttractive(request.isAttractive());
        if (request.orchidURL() != null) orchid.setOrchidURL(request.orchidURL());

        Orchid saved = orchidRepository.save(orchid);
        return mapToResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!orchidRepository.existsById(id)) {
            throw new IllegalArgumentException("Orchid not found with ID: " + id);
        }
        orchidRepository.deleteById(id);
    }

    private OrchidResponse mapToResponse(Orchid o) {
        return new OrchidResponse(
                o.getOrchidID(),
                o.getOrchidName(),
                o.getIsNatural(),
                o.getOrchidDescription(),
                o.getIsAttractive(),
                o.getOrchidURL()
        );
    }
}
