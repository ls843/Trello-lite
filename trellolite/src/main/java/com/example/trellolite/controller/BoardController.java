package com.example.trellolite.controller;

import com.example.trellolite.dto.BoardRequestDTO;
import com.example.trellolite.dto.BoardResponseDTO;
import com.example.trellolite.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "http://localhost:4200")
public class BoardController {
    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @PostMapping
    public BoardResponseDTO createBoard(@Valid @RequestBody BoardRequestDTO dto) {
        return boardService.createBoard(dto);
    }

    @GetMapping
    public List<BoardResponseDTO> getAllBoards() {
        return boardService.getAllBoards();
    }

    @DeleteMapping("/{id}")
    public void deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
    }
}
