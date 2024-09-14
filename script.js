let button = document.querySelector("button");
    const task = document.querySelector("#write");
    const category = document.querySelector("#category");
    let assignedTasksContainer = document.querySelector(".tasksContainer");
    let completedTasksContainer = document.querySelector(
      ".completedTasksContainer"
    );
    let modal = document.getElementById("missingFieldsModal");
    let closeModal = document.getElementById("closeMissingFieldsModal");

    // Handle the button click and check for missing fields
    button.addEventListener("click", () => {
      if (task.value.trim() === "" || category.value.trim() === "") {
        modal.classList.remove("hidden"); // Show the error modal
      } else {
        operation();
      }
    });

    // Input handling: task and category required
    [task, category].forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          if (task.value.trim() !== "" && category.value.trim() !== "") {
            operation();
          } else {
            modal.classList.remove("hidden"); // Show the error modal
          }
        }
      });
    });

    // Close the error modal
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden"); // Hide the modal
    });

    // Add event listener for "Confirm" button outside the pencil click
    document.getElementById("confirmRename").addEventListener("click", () => {
      const renameInput = document.getElementById("renameInput");

      if (currentTaskItem && renameInput.value.trim() !== "") {
        currentTaskItem.textContent = renameInput.value.trim();
        document
          .getElementById("renameModal")
          .classList.remove("modal-active"); // Hide modal
        currentTaskItem = null; // Reset after renaming
      }
    });

    // Add event listener for "Cancel" button outside the pencil click
    document.getElementById("cancelRename").addEventListener("click", () => {
      document.getElementById("renameModal").classList.remove("modal-active"); // Hide modal
      currentTaskItem = null; // Reset the current task when canceling
    });
    function operation() {
      let categoryElement = document.querySelector(
        `.category[data-category="${category.value}"]`
      );

      if (!categoryElement) {
        categoryElement = document.createElement("div");
        categoryElement.className = "category";
        categoryElement.dataset.category = category.value;
        categoryElement.innerHTML = ` <h3>${category.value}</h3><ul></ul>`;
        assignedTasksContainer.appendChild(categoryElement);
      }

      const taskList = categoryElement.querySelector("ul");
      const taskItem = document.createElement("li");

      // Wrap the task text inside a <span> element
      let taskText = document.createElement("span");
      taskText.textContent = task.value;
      taskItem.appendChild(taskText);

      let contain = document.createElement("div");
      contain.classList.add("contain");

      // Rename (pencil) icon
      let pencil = document.createElement("i");
      pencil.classList.add("fa-solid", "fa-pencil", "fa-edit", "pencil");
      // Pencil click event to open rename modal
      pencil.addEventListener("click", () => {
        const modal = document.getElementById("renameModal");
        const renameInput = document.getElementById("renameInput");

        // Set the current task to be renamed
        currentTaskItem = taskText;

        // Set the input value to the current task's text
        renameInput.value = currentTaskItem.textContent;

        // Show the modal
        modal.classList.add("modal-active");
      });

      // Clear the task input after adding the task
      task.value = "";

      // Tick icon for moving to completed
      let tick = document.createElement("i");
      tick.classList.add("fa-solid", "fa-check", "tick");
      tick.addEventListener("click", moveToComplete);

      // Trash icon for deleting task
      let trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash", "trash");
      trash.addEventListener("click", () => {
        taskItem.classList.add("gone");
        taskItem.addEventListener("animationend", () => {
          taskList.removeChild(taskItem);
          // Check if all tasks are removed, then remove the heading too
          if (taskList.children.length === 0) {
            assignedTasksContainer.removeChild(categoryElement);
          }
        });
      });

      taskItem.appendChild(contain);
      contain.appendChild(pencil);
      contain.appendChild(tick);
      contain.appendChild(trash);
      taskList.appendChild(taskItem);

      task.value = ""; // Clear the task input
    }

    function moveToComplete(event) {
      const originalTaskItem = event.target.closest("li");
      const categoryElement = originalTaskItem.closest(".category");

      // Apply line-through style to the text content only (the <span> element)
      const taskText = originalTaskItem.querySelector("span");
      taskText.style.textDecoration = "line-through";
      taskText.style.textDecorationColor = "#563D1F";
      taskText.style.textDecorationThickness = "2px";
      // taskText.style.color = "#B0BEC5";

      // Find or create the category element in completed tasks
      let completedCategoryElement = document.querySelector(
        `.completedTasksContainer .category[data-category="${categoryElement.dataset.category}"]`
      );

      if (!completedCategoryElement) {
        completedCategoryElement = document.createElement("div");
        completedCategoryElement.className = "category";
        completedCategoryElement.dataset.category =
          categoryElement.dataset.category;
        completedCategoryElement.innerHTML = `<h3>${categoryElement.dataset.category}</h3><ul></ul>`;
        completedTasksContainer.appendChild(completedCategoryElement);
      }

      const completedTaskList = completedCategoryElement.querySelector("ul");

      // Clone the task item for the completed list
      const completedTaskItem = originalTaskItem.cloneNode(true);

      // Remove line-through and reset color for the cloned task in the completed list
      const clonedTaskText = completedTaskItem.querySelector("span");
      clonedTaskText.style.textDecoration = "none"; // Reset text decoration
      clonedTaskText.style.color = ""; // Reset color to default

      // Remove tick and rename icons from the cloned task in the completed tasks
      completedTaskItem.querySelector(".tick").remove();
      completedTaskItem.querySelector(".pencil").remove();

      // Add the cloned task to the completed tasks list
      completedTaskList.appendChild(completedTaskItem);

      // Allow trash to delete the task from the completed tasks
      completedTaskItem
        .querySelector(".trash")
        .addEventListener("click", () => {
          completedTaskItem.classList.add("gone");
          completedTaskItem.addEventListener("animationend", () => {
            completedTaskItem.remove();
            if (completedTaskList.children.length === 0) {
              completedTasksContainer.removeChild(completedCategoryElement);
            }
          });
        });
    }