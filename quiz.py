import tkinter as tk
import json
import random

# Load questions from JSON file
def load_questions(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Shuffle questions and reset state
def start_quiz():
    global current_question, score, questions
    random.shuffle(questions)  # Shuffle questions for a random order
    current_question = 0
    score = 0
    feedback_label.config(text="")
    points_label.config(text="")
    submit_btn.config(state=tk.NORMAL)
    next_btn.config(state=tk.DISABLED)
    retake_btn.pack_forget()  # Hide retake button
    next_question()

# Function to check answers and display feedback in the UI
def check_answers():
    global current_question, score

    selected_indexes = [idx for idx, var in enumerate(answer_vars) if var.get() == 1]
    correct_indexes = [idx for idx, option in enumerate(questions[current_question]['options']) if option['correct']]

    if not selected_indexes:  # No answers selected
        feedback_label.config(text="Please select at least one option to proceed.", fg="orange")
        return

    # Calculate points for the current question
    question_points = 0
    correct_selected = 0
    for idx in selected_indexes:
        if idx in correct_indexes:
            question_points += 0.25  # Correctly selected
            correct_selected += 1
            options[idx].config(fg="green")
        else:
            question_points -= 0.25  # Incorrectly selected
            options[idx].config(fg="red")

    # Count the number of correct answers available
    total_correct = len(correct_indexes)

    # Update score and feedback
    score += question_points
    feedback_label.config(
        text=f"{'Correct!' if question_points > 0 else 'Wrong!'} You selected {correct_selected} out of {total_correct} correct answers. "
             f"You scored {question_points:.2f} points for this question.",
        fg="green" if question_points > 0 else "red",
    )
    points_label.config(text=f"Total Points: {score:.2f}")

    # Disable the Submit button and enable the Next button
    submit_btn.config(state=tk.DISABLED)
    next_btn.config(state=tk.NORMAL)

# Function to show the next question
def next_question():
    global current_question
    current_question += 1

    if current_question >= len(questions):
        feedback_label.config(text=f"Quiz Completed! Your total score: {score:.2f}/{len(questions) * 0.75}", fg="blue")
        submit_btn.config(state=tk.DISABLED)
        next_btn.config(state=tk.DISABLED)
        retake_btn.pack(pady=20)  # Show the Retake Quiz button
        return

    # Reset UI for the next question
    question_label.config(text=questions[current_question]['question'], wraplength=500, justify="left")
    for idx, option in enumerate(questions[current_question]['options']):
        options[idx].config(text=option['text'], fg="black")
        answer_vars[idx].set(0)

    # Reset buttons and feedback
    submit_btn.config(state=tk.NORMAL)
    next_btn.config(state=tk.DISABLED)
    feedback_label.config(text="")

# Initialize the main Tkinter window
root = tk.Tk()
root.title("Relational Algebra Quiz")
root.configure(bg="#f0f0f0")  # Light grey background

# Load questions
questions = load_questions("questions.json")
current_question = 0
score = 0

# UI Elements
question_frame = tk.Frame(root, bg="white", padx=10, pady=10, relief="ridge", borderwidth=2)
question_frame.pack(pady=20, padx=20)

question_label = tk.Label(question_frame, text="", font=("Arial", 16, "bold"), wraplength=500, justify="left", bg="white")
question_label.pack(pady=10)

answer_vars = []
options = []

# Create option buttons
for i in range(5):  # Max number of options is 5
    var = tk.IntVar()
    answer_vars.append(var)
    btn = tk.Checkbutton(root, text="", variable=var, font=("Arial", 14), anchor="w", bg="white", fg="black", relief="flat")
    btn.pack(fill="x", padx=30, pady=5)
    options.append(btn)

feedback_label = tk.Label(root, text="", font=("Arial", 14), bg="#f0f0f0")
feedback_label.pack(pady=10)

points_label = tk.Label(root, text="", font=("Arial", 12), bg="#f0f0f0", fg="blue")
points_label.pack(pady=5)

button_frame = tk.Frame(root, bg="#f0f0f0")
button_frame.pack(pady=10)

submit_btn = tk.Button(button_frame, text="Submit Answer", command=check_answers, font=("Arial", 12), bg="white", relief="raised")
submit_btn.grid(row=0, column=0, padx=5)

next_btn = tk.Button(button_frame, text="Next Question", command=next_question, font=("Arial", 12), bg="white", relief="raised", state=tk.DISABLED)
next_btn.grid(row=0, column=1, padx=5)

retake_btn = tk.Button(root, text="Retake Quiz", command=start_quiz, font=("Arial", 12), bg="white", relief="raised")
retake_btn.pack_forget()  # Hide initially

# Start the quiz
start_quiz()

# Run the Tkinter event loop
root.mainloop()
