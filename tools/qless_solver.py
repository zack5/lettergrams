# MASSIVE WORK IN PROGRESS #

import json

class Grid:
    def __init__(self, size: int):
        self.size = size
        self.grid = [['.' for _ in range(size)] for _ in range(size)]

    def __getitem__(self, y):
        return self.grid[y]

    def __setitem__(self, y, x, value):
        self.grid[y][x] = value

    def __str__(self):
        return '\n'.join([''.join(row) for row in self.grid])
    
    def place_word(self, word: str, y: int, x: int, isHorizontal: bool):
        if isHorizontal:
            if x + len(word) > self.size:
                return False
            for i, c in enumerate(word):
                self.grid[y][x + i] = c
        else:
            if y + len(word) > self.size:
                return False
            for i, c in enumerate(word):
                self.grid[y + i][x] = c
        return True
    

class Solver:
    NUM_TILES = 12
    BOARD_SIZE = int(NUM_TILES * 1.5)

    def __init__(self):
        with open('../shared/src/data/words.json', 'r') as f:
            self.all_words = set(json.load(f)[0].split(','))

    def place_first_word(self, words: set[str]) -> tuple[Grid, set[str]]:
        grid = Grid(self.BOARD_SIZE)
        grid.place_word(words[0], self.BOARD_SIZE//2, self.BOARD_SIZE//2 - len(words[0])//2, True)
        return grid, self.all_words - {words[0]}

    def generate_solutions(self):
        grid, words = self.place_first_word(self.all_words)
        print(grid, words)

if __name__ == '__main__':
    solver = Solver()
    solver.generate_solutions()