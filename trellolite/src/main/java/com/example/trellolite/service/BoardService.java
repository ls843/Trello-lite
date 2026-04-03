package com.example.trellolite.service;

import com.example.trellolite.dto.BoardRequestDTO;
import com.example.trellolite.dto.BoardResponseDTO;
import com.example.trellolite.model.Board;
import com.example.trellolite.repository.BoardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardService {
    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public BoardResponseDTO createBoard(BoardRequestDTO dto) {
        Board board = new Board();
        board.setName(dto.getName());

        Board saved = boardRepository.save(board);

        return mapToResponse(saved);
    }

    public List<BoardResponseDTO> getAllBoards() {
        return boardRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Board getById(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public void deleteBoard(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        boardRepository.delete(board);
    }

    private BoardResponseDTO mapToResponse(Board board) {
        BoardResponseDTO dto = new BoardResponseDTO();

        dto.setId(board.getId());
        dto.setName(board.getName());
        dto.setCreatedAt(board.getCreatedAt());

        return dto;
    }
}
