package com.Schoolai.WebModule.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Schoolai.WebModule.dto.BroadcastRequest;
import com.Schoolai.WebModule.service.BroadcastService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/broadcast")
@RequiredArgsConstructor
public class BroadcastController {

	private final BroadcastService broadcastService;

	@PostMapping
	public ResponseEntity<Integer> broadcast(@RequestBody BroadcastRequest request) {
		int count = broadcastService.broadcast(request);
		return ResponseEntity.ok(count);
	}
}


