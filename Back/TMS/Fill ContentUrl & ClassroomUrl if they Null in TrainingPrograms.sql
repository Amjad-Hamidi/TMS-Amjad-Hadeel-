-- fill ContentUrl + ClassroomUrl if there is Null
UPDATE TrainingPrograms 
SET ContentUrl = 'https://placeholder.com/content',
    ClassroomUrl = 'https://placeholder.com/classroom'
WHERE ContentUrl IS NULL OR ClassroomUrl IS NULL;