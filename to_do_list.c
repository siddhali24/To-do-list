 #include <stdio.h>
#include <stdlib.h>
#define MAX_SIZE 100
 
struct Task{
    int priority;
    char* description;
};
struct PriorityQueue{
    int size;
    struct Task* tasks[MAX_SIZE];
};

struct PriorityQueue* createPriorityQueue() {
    struct PriorityQueue* pq = (struct PriorityQueue*)malloc(sizeof(struct PriorityQueue));
    pq->size = 0;
    return pq;
}
int isFull(struct PriorityQueue* pq) {
    return (pq->size == MAX_SIZE);
}
int isEmpty(struct PriorityQueue* pq) {
    return (pq->size == 0);
}
void enqueue(struct PriorityQueue* pq, struct Task* task) {
    if (isFull(pq))
        return;
    int i = pq->size - 1;
    while (i >= 0 && pq->tasks[i]->priority > task->priority) {
        pq->tasks[i + 1] = pq->tasks[i];
        i--;
    }
    pq->tasks[i + 1] = task;
    pq->size++;
}

struct Task* dequeue(struct PriorityQueue* pq) {
    if (isEmpty(pq))
        return NULL;
    struct Task* task = pq->tasks[pq->size - 1];
    pq->size--;
    return task;
}
void printTasks(struct PriorityQueue* pq) {
    if (isEmpty(pq)) {
        printf("No tasks in the to-do list.\n");
        return;
    }
    printf("Tasks in the to-do list:\n");
    for (int i = pq->size - 1; i >= 0; i--) {
        printf("Priority: %d, Description: %s\n", pq->tasks[i]->priority, pq->tasks[i]->description);
    }
}

void main() {
    struct Task task1 = {2, "Complete report"};
    struct Task task2 = {1, "Reply to emails"};
    struct Task task3 = {3, "Prepare presentation"};

    struct PriorityQueue* pq = createPriorityQueue();
    enqueue(pq, &task1);
    enqueue(pq, &task2);
    enqueue(pq, &task3);

    printf("Tasks before processing:\n");
    printTasks(pq);

    printf("\nProcessing tasks based on priority:\n");
    while (!isEmpty(pq)) {
        struct Task* currentTask = dequeue(pq);
        printf("Task: %s\n", currentTask->description);
    }

    return 0;
}
