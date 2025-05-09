import random
import json

class Solver:
    VOWELS = 'aeiou'

    def __init__(self):
        with open('../shared/src/data/words.json', 'r') as f:
            self.all_words = json.load(f)

    def generate_solutions(self):
        words = []

        for i in range(len(self.all_words)):
            word1 = self.all_words[i]

            # Skip words with three or more vowels
            vowel_count_1 = sum(1 for letter in word1 if letter in self.VOWELS)
            if vowel_count_1 >= 4:
                continue

            for j in range(i + 1, len(self.all_words)):
                word2 = self.all_words[j]

                if (len(word1) + len(word2) != 13):
                    continue

                vowel_count_2 = sum(1 for letter in word2 if letter in self.VOWELS)
                vowel_sum = vowel_count_1 + vowel_count_2
                if vowel_sum >= 4:
                    continue;

                remove_index = 0
                common_letters = list(set(word1) & set(word2))
                # If vowel_sum equals 4 and there is a vowel in common letters, remove the vowel
                if vowel_sum == 4:
                    vowels_in_common = [letter for letter in common_letters if letter in self.VOWELS]
                    if len(vowels_in_common) > 0:
                        # Set remove_index to the index of the vowel in common_letters
                        remove_index = common_letters.index(vowels_in_common[0])
                
                # If vowel_sum equals 1 and there is not a vowel in common letters, continue
                if vowel_sum == 1:
                    vowels_in_common = [letter for letter in common_letters if letter in self.VOWELS]
                    if len(vowels_in_common) == 0:
                        continue
                    
                if len(common_letters) > 1:
                    common_letter = common_letters[remove_index]
                    commmon_index = word2.find(common_letter)
                    word2 = word2[:commmon_index] + word2[commmon_index + 1:]
                    combined_letters = list(word1 + word2)
                    random.shuffle(combined_letters)
                    words.append(''.join(combined_letters))
        
        with open('DailyOptions.json', 'w') as f:
            json.dump(words[:1000], f)
        print(len(words))

if __name__ == '__main__':
    solver = Solver()
    solver.generate_solutions()