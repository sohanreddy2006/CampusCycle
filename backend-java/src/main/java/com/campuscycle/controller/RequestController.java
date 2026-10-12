package com.campuscycle.controller;

import com.campuscycle.dto.RequestDtos.CreateRequestRequest;
import com.campuscycle.dto.RequestDtos.FulfillRequestRequest;
import com.campuscycle.dto.RequestDtos.RequestPageResponse;
import com.campuscycle.dto.RequestDtos.RequestResponse;
import com.campuscycle.dto.RequestDtos.UpdateRequestRequest;
import com.campuscycle.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<RequestResponse> createRequest(@Valid @RequestBody CreateRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestService.createRequest(request));
    }

    @GetMapping
    public ResponseEntity<RequestPageResponse> getRequests(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long domain,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "active") String status,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "12") Integer limit,
            @RequestParam(required = false, defaultValue = "-createdAt") String sort) {
        return ResponseEntity.ok(requestService.getRequests(search, type, domain, category, status, page, limit, sort));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RequestResponse>> getMyRequests() {
        return ResponseEntity.ok(requestService.getMyRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestResponse> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequest(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestResponse> updateRequest(@PathVariable Long id,
                                                         @RequestBody UpdateRequestRequest request) {
        return ResponseEntity.ok(requestService.updateRequest(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.deleteRequest(id));
    }

    @PutMapping("/{id}/fulfill")
    public ResponseEntity<RequestResponse> fulfillRequest(@PathVariable Long id,
                                                          @RequestBody(required = false) FulfillRequestRequest request) {
        return ResponseEntity.ok(requestService.fulfillRequest(id,
                request != null ? request : new FulfillRequestRequest(null)));
    }
}
