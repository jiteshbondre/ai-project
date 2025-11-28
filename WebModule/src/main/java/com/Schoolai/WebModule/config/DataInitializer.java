package com.Schoolai.WebModule.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.Schoolai.WebModule.entity.Assessment;
import com.Schoolai.WebModule.entity.Assignment;
import com.Schoolai.WebModule.entity.AssignmentSubmission;
import com.Schoolai.WebModule.entity.Attendance;
import com.Schoolai.WebModule.entity.ChatHistory;
import com.Schoolai.WebModule.entity.Curriculum;
import com.Schoolai.WebModule.entity.ExtraActivity;
import com.Schoolai.WebModule.entity.Notification;
import com.Schoolai.WebModule.entity.ParentGuardian;
import com.Schoolai.WebModule.entity.Payment;
import com.Schoolai.WebModule.entity.Performance;
import com.Schoolai.WebModule.entity.ReportStatus;
import com.Schoolai.WebModule.entity.School;
import com.Schoolai.WebModule.entity.Student;
import com.Schoolai.WebModule.entity.Subject;
import com.Schoolai.WebModule.entity.Teacher;
import com.Schoolai.WebModule.entity.Timetable;
import com.Schoolai.WebModule.entity.Topic;
import com.Schoolai.WebModule.entity.Video;
import com.Schoolai.WebModule.entity.VideoView;
import com.Schoolai.WebModule.repository.AssessmentRepository;
import com.Schoolai.WebModule.repository.AssignmentRepository;
import com.Schoolai.WebModule.repository.AssignmentSubmissionRepository;
import com.Schoolai.WebModule.repository.AttendanceRepository;
import com.Schoolai.WebModule.repository.ChatHistoryRepository;
import com.Schoolai.WebModule.repository.CurriculumRepository;
import com.Schoolai.WebModule.repository.ExtraActivityRepository;
import com.Schoolai.WebModule.repository.NotificationRepository;
import com.Schoolai.WebModule.repository.ParentGuardianRepository;
import com.Schoolai.WebModule.repository.PaymentRepository;
import com.Schoolai.WebModule.repository.PerformanceRepository;
import com.Schoolai.WebModule.repository.ReportStatusRepository;
import com.Schoolai.WebModule.repository.SchoolRepository;
import com.Schoolai.WebModule.repository.StudentRepository;
import com.Schoolai.WebModule.repository.SubjectRepository;
import com.Schoolai.WebModule.repository.TeacherRepository;
import com.Schoolai.WebModule.repository.TimetableRepository;
import com.Schoolai.WebModule.repository.TopicRepository;
import com.Schoolai.WebModule.repository.VideoRepository;
import com.Schoolai.WebModule.repository.VideoViewRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private CurriculumRepository curriculumRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ParentGuardianRepository parentGuardianRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssignmentSubmissionRepository assignmentSubmissionRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private VideoViewRepository videoViewRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private ExtraActivityRepository extraActivityRepository;

    @Autowired
    private ReportStatusRepository reportStatusRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Check if data already exists (check for at least 5 schools AND assignment_submissions to ensure full initialization)
        if (schoolRepository.count() >= 5 && assignmentSubmissionRepository.count() >= 5) {
            System.out.println("Data already initialized. Skipping...");
            return;
        }

        System.out.println("Initializing database with sample data...");
        
        // Clear existing data if any exists (partial data)
        if (schoolRepository.count() > 0) {
            System.out.println("Clearing existing partial data...");
            
            // Delete in order to respect foreign key constraints
            assignmentSubmissionRepository.deleteAll();
            videoViewRepository.deleteAll();
            performanceRepository.deleteAll();
            attendanceRepository.deleteAll();
            extraActivityRepository.deleteAll();
            reportStatusRepository.deleteAll();
            paymentRepository.deleteAll();
            chatHistoryRepository.deleteAll();
            notificationRepository.deleteAll();
            topicRepository.deleteAll();
            timetableRepository.deleteAll();
            videoRepository.deleteAll();
            assessmentRepository.deleteAll();
            assignmentRepository.deleteAll();
            parentGuardianRepository.deleteAll();
            studentRepository.deleteAll();
            teacherRepository.deleteAll();
            subjectRepository.deleteAll();
            curriculumRepository.deleteAll();
            schoolRepository.deleteAll();
            
            // Reset sequences using RESTART IDENTITY
            try {
                entityManager.createNativeQuery("TRUNCATE TABLE school RESTART IDENTITY CASCADE").executeUpdate();
            } catch (Exception e) {
                // If truncate fails, sequences will auto-increment from max+1
                System.out.println("Note: Using deleteAll instead of TRUNCATE");
            }
            
            System.out.println("Existing data cleared.");
        }

        // 1. Create Schools (5 schools)
        List<School> schools = createSchools();
        schoolRepository.saveAll(schools);
        System.out.println("Created " + schools.size() + " schools");

        // 2. Create Curricula (5 curricula, linked to schools)
        List<Curriculum> curricula = createCurricula(schools);
        curriculumRepository.saveAll(curricula);
        System.out.println("Created " + curricula.size() + " curricula");

        // 3. Create Subjects (5+ subjects, linked to curricula)
        List<Subject> subjects = createSubjects(curricula);
        subjectRepository.saveAll(subjects);
        System.out.println("Created " + subjects.size() + " subjects");

        // 4. Create Teachers (5+ teachers, linked to schools and subjects)
        List<Teacher> teachers = createTeachers(schools, subjects);
        teacherRepository.saveAll(teachers);
        System.out.println("Created " + teachers.size() + " teachers");

        // 5. Create Students (5+ students, linked to schools and curricula)
        List<Student> students = createStudents(schools, curricula);
        studentRepository.saveAll(students);
        System.out.println("Created " + students.size() + " students");

        // 6. Create Parent Guardians (5+ parents, linked to students)
        List<ParentGuardian> parents = createParentGuardians(students);
        parentGuardianRepository.saveAll(parents);
        System.out.println("Created " + parents.size() + " parent guardians");

        // 7. Create Assignments (5+ assignments, linked to subjects and teachers)
        List<Assignment> assignments = createAssignments(subjects, teachers);
        assignmentRepository.saveAll(assignments);
        System.out.println("Created " + assignments.size() + " assignments");

        // 8. Create Assessments (5+ assessments, linked to subjects and teachers)
        List<Assessment> assessments = createAssessments(subjects, teachers);
        assessmentRepository.saveAll(assessments);
        System.out.println("Created " + assessments.size() + " assessments");

        // 9. Create Topics (5+ topics, linked to subjects and teachers)
        List<Topic> topics = createTopics(subjects, teachers);
        topicRepository.saveAll(topics);
        System.out.println("Created " + topics.size() + " topics");

        // 10. Create Videos (5+ videos, linked to subjects and teachers)
        List<Video> videos = createVideos(subjects, teachers);
        videoRepository.saveAll(videos);
        System.out.println("Created " + videos.size() + " videos");

        // 11. Create Timetables (5+ timetables, linked to subjects and teachers)
        List<Timetable> timetables = createTimetables(subjects, teachers);
        timetableRepository.saveAll(timetables);
        System.out.println("Created " + timetables.size() + " timetables");

        // 12. Create Attendances (5+ attendances, linked to students)
        List<Attendance> attendances = createAttendances(students);
        attendanceRepository.saveAll(attendances);
        System.out.println("Created " + attendances.size() + " attendances");

        // 13. Create Performances (5+ performances, linked to students and assessments)
        List<Performance> performances = createPerformances(students, assessments);
        performanceRepository.saveAll(performances);
        System.out.println("Created " + performances.size() + " performances");

        // 14. Create Assignment Submissions (5+ submissions, linked to assignments, students, subjects)
        // Use native SQL to avoid Hibernate bytea column ordering issues
        try {
            for (int i = 0; i < 8; i++) {
                Integer assignmentId = assignments.get(i % assignments.size()).getId();
                Integer studentId = students.get(i % students.size()).getId();
                Integer subjectId = subjects.get(i % subjects.size()).getId();
                String fileName = "homework" + (i + 1) + ".pdf";
                String filePath = "/uploads/" + fileName;
                Long fileSize = (long) (1024 * (i + 1));
                String fileType = "application/pdf";
                String notes = "Submitted on time with all requirements met";
                String aiFeedback = "Good work! Keep it up.";
                
                String sql = "INSERT INTO assignment_submission " +
                    "(assignment_id, student_id, subject_id, file_name, file_path, file_size, file_type, notes, submitted_at, ai_feedback, file_data) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)";
                
                entityManager.createNativeQuery(sql)
                    .setParameter(1, assignmentId)
                    .setParameter(2, studentId)
                    .setParameter(3, subjectId)
                    .setParameter(4, fileName)
                    .setParameter(5, filePath)
                    .setParameter(6, fileSize)
                    .setParameter(7, fileType)
                    .setParameter(8, notes)
                    .setParameter(9, LocalDateTime.now().minusDays(5 - i))
                    .setParameter(10, aiFeedback)
                    .executeUpdate();
            }
            entityManager.flush();
            System.out.println("Created 8 assignment submissions");
        } catch (Exception e) {
            System.out.println("Warning: Could not create assignment submissions: " + e.getMessage());
            e.printStackTrace();
        }

        // 15. Create Video Views (5+ views, linked to videos and students)
        List<VideoView> videoViews = createVideoViews(videos, students);
        videoViewRepository.saveAll(videoViews);
        System.out.println("Created " + videoViews.size() + " video views");

        // 16. Create Payments (5+ payments, linked to students)
        List<Payment> payments = createPayments(students);
        paymentRepository.saveAll(payments);
        System.out.println("Created " + payments.size() + " payments");

        // 17. Create Extra Activities (5+ activities, linked to students)
        List<ExtraActivity> extraActivities = createExtraActivities(students);
        extraActivityRepository.saveAll(extraActivities);
        System.out.println("Created " + extraActivities.size() + " extra activities");

        // 18. Create Report Statuses (5+ reports, linked to students)
        List<ReportStatus> reportStatuses = createReportStatuses(students);
        reportStatusRepository.saveAll(reportStatuses);
        System.out.println("Created " + reportStatuses.size() + " report statuses");

        // 19. Create Notifications (5+ notifications)
        List<Notification> notifications = createNotifications(students, teachers);
        notificationRepository.saveAll(notifications);
        System.out.println("Created " + notifications.size() + " notifications");

        // 20. Create Chat Histories (5+ chat histories)
        List<ChatHistory> chatHistories = createChatHistories(students, teachers);
        chatHistoryRepository.saveAll(chatHistories);
        System.out.println("Created " + chatHistories.size() + " chat histories");

        System.out.println("Database initialization completed successfully!");
    }

    private List<School> createSchools() {
        List<School> schools = new ArrayList<>();
        schools.add(School.builder().schoolName("NIRMAL SCHOOL").address("123 Main Street, City").board("CBSE").build());
        schools.add(School.builder().schoolName("Greenwood High School").address("456 Oak Avenue, Town").board("ICSE").build());
        schools.add(School.builder().schoolName("Sunshine Academy").address("789 Pine Road, Village").board("State Board").build());
        schools.add(School.builder().schoolName("Elite International School").address("321 Elm Street, Metro").board("IB").build());
        schools.add(School.builder().schoolName("Bright Future School").address("654 Maple Drive, District").board("CBSE").build());
        return schools;
    }

    private List<Curriculum> createCurricula(List<School> schools) {
        List<Curriculum> curricula = new ArrayList<>();
        String[] mediums = {"English", "Hindi", "Marathi", "Gujarati", "Tamil"};
        String[] classes = {"Class 1", "Class 2", "Class 3", "Class 4", "Class 5"};
        
        for (int i = 0; i < 5; i++) {
            curricula.add(Curriculum.builder()
                    .school(schools.get(i % schools.size()))
                    .className(classes[i])
                    .medium(mediums[i])
                    .description("Curriculum for " + classes[i] + " in " + mediums[i] + " medium")
                    .build());
        }
        return curricula;
    }

    private List<Subject> createSubjects(List<Curriculum> curricula) {
        List<Subject> subjects = new ArrayList<>();
        String[] subjectNames = {"Mathematics", "Science", "English", "Social Studies", "Hindi", "Physics", "Chemistry", "Biology"};
        
        for (int i = 0; i < 8; i++) {
            subjects.add(Subject.builder()
                    .subjectName(subjectNames[i])
                    .className("Class " + ((i % 5) + 1))
                    .curriculum(curricula.get(i % curricula.size()))
                    .build());
        }
        return subjects;
    }

    private List<Teacher> createTeachers(List<School> schools, List<Subject> subjects) {
        List<Teacher> teachers = new ArrayList<>();
        String[] names = {"Dr. Sarah Johnson", "Prof. Michael Chen", "Ms. Emily Davis", "Mr. Robert Wilson", "Dr. Lisa Anderson", "Mr. James Brown"};
        String[] emails = {"sarah.johnson@school.com", "michael.chen@school.com", "emily.davis@school.com", 
                          "robert.wilson@school.com", "lisa.anderson@school.com", "james.brown@school.com"};
        String[] contacts = {"9876543210", "9876543211", "9876543212", "9876543213", "9876543214", "9876543215"};
        String[] qualifications = {"Ph.D. in Mathematics", "M.Sc. in Physics", "M.A. in English", 
                                  "M.Sc. in Chemistry", "Ph.D. in Biology", "M.A. in History"};
        String[] designations = {"Senior Teacher", "Head of Department", "Teacher", "Senior Teacher", "Professor", "Teacher"};
        
        for (int i = 0; i < 6; i++) {
            teachers.add(Teacher.builder()
                    .fullName(names[i])
                    .email(emails[i])
                    .password(passwordEncoder.encode("teacher123"))
                    .contactNo(contacts[i])
                    .dob(LocalDate.of(1980 + i, 5, 15 + i))
                    .qualification(qualifications[i])
                    .experienceYears(10 + i)
                    .designation(designations[i])
                    .school(schools.get(i % schools.size()))
                    .subject(subjects.get(i % subjects.size()))
                    .build());
        }
        return teachers;
    }

    private List<Student> createStudents(List<School> schools, List<Curriculum> curricula) {
        List<Student> students = new ArrayList<>();
        String[] names = {"Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Vikram Mehta", 
                         "Anjali Desai", "Rohan Gupta", "Kavya Reddy"};
        String[] emails = {"rahul.sharma@student.com", "priya.patel@student.com", "amit.kumar@student.com",
                          "sneha.singh@student.com", "vikram.mehta@student.com", "anjali.desai@student.com",
                          "rohan.gupta@student.com", "kavya.reddy@student.com"};
        String[] contacts = {"9123456780", "9123456781", "9123456782", "9123456783", "9123456784", 
                            "9123456785", "9123456786", "9123456787"};
        String[] classes = {"Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 1", "Class 2", "Class 3"};
        String[] mediums = {"English", "Hindi", "Marathi", "Gujarati", "Tamil", "English", "Hindi", "Marathi"};
        String[] genders = {"Male", "Female", "Male", "Female", "Male", "Female", "Male", "Female"};
        
        for (int i = 0; i < 8; i++) {
            students.add(Student.builder()
                    .fullName(names[i])
                    .className(classes[i])
                    .school(schools.get(i % schools.size()))
                    .password(passwordEncoder.encode("student123"))
                    .medium(mediums[i])
                    .email(emails[i])
                    .contactNo(contacts[i])
                    .dob(LocalDate.of(2010 + (i % 5), 3 + (i % 12), 10 + i))
                    .gender(genders[i])
                    .address("Address " + (i + 1) + ", City")
                    .admissionDate(LocalDate.of(2020, 4, 1))
                    .curriculum(curricula.get(i % curricula.size()))
                    .build());
        }
        return students;
    }

    private List<ParentGuardian> createParentGuardians(List<Student> students) {
        List<ParentGuardian> parents = new ArrayList<>();
        String[] names = {"Rajesh Sharma", "Meera Patel", "Suresh Kumar", "Geeta Singh", "Mohan Mehta",
                         "Sunita Desai", "Vikash Gupta", "Lakshmi Reddy"};
        String[] relations = {"Father", "Mother", "Father", "Mother", "Father", "Mother", "Father", "Mother"};
        String[] emails = {"rajesh.sharma@parent.com", "meera.patel@parent.com", "suresh.kumar@parent.com",
                          "geeta.singh@parent.com", "mohan.mehta@parent.com", "sunita.desai@parent.com",
                          "vikash.gupta@parent.com", "lakshmi.reddy@parent.com"};
        String[] contacts = {"9234567890", "9234567891", "9234567892", "9234567893", "9234567894",
                            "9234567895", "9234567896", "9234567897"};
        
        for (int i = 0; i < 8; i++) {
            parents.add(ParentGuardian.builder()
                    .student(students.get(i % students.size()))
                    .fullName(names[i])
                    .relation(relations[i])
                    .email(emails[i])
                    .contactNo(contacts[i])
                    .build());
        }
        return parents;
    }

    private List<Assignment> createAssignments(List<Subject> subjects, List<Teacher> teachers) {
        List<Assignment> assignments = new ArrayList<>();
        String[] titles = {"Math Homework Chapter 1", "Science Project", "English Essay", "History Report", 
                          "Physics Lab Report", "Chemistry Assignment", "Biology Worksheet", "Geography Map"};
        String[] types = {"Homework", "Project", "Essay", "Report", "Lab Report", "Assignment", "Worksheet", "Map"};
        
        for (int i = 0; i < 8; i++) {
            assignments.add(Assignment.builder()
                    .subject(subjects.get(i % subjects.size()))
                    .title(titles[i])
                    .dueDate(LocalDate.now().plusDays(7 + i))
                    .description("Complete " + titles[i] + " with detailed explanations")
                    .assignedBy(teachers.get(i % teachers.size()))
                    .type(types[i])
                    .submissionTime(LocalDateTime.now().plusDays(7 + i))
                    .instructions("Follow the guidelines provided in class")
                    .submittedOn(null)
                    .maxMarks(100)
                    .build());
        }
        return assignments;
    }

    private List<Assessment> createAssessments(List<Subject> subjects, List<Teacher> teachers) {
        List<Assessment> assessments = new ArrayList<>();
        String[] titles = {"Quarterly Exam - Math", "Mid-term Science Test", "English Literature Test", 
                          "History Quiz", "Physics Unit Test", "Chemistry Assessment", "Biology Exam", "Geography Test"};
        
        for (int i = 0; i < 8; i++) {
            assessments.add(Assessment.builder()
                    .subject(subjects.get(i % subjects.size()))
                    .title(titles[i])
                    .dueDate(LocalDate.now().plusDays(14 + i))
                    .assignedBy(teachers.get(i % teachers.size()))
                    .build());
        }
        return assessments;
    }

    private List<Topic> createTopics(List<Subject> subjects, List<Teacher> teachers) {
        List<Topic> topics = new ArrayList<>();
        String[] titles = {"Introduction to Algebra", "Cell Structure", "Shakespeare's Works", 
                           "World War II", "Newton's Laws", "Chemical Reactions", "Human Anatomy", "Climate Change"};
        String[] descriptions = {"Basic algebraic concepts and equations", "Understanding cell components",
                                "Analysis of Shakespeare's major works", "Causes and effects of WWII",
                                "Newton's three laws of motion", "Types of chemical reactions",
                                "Study of human body systems", "Global climate patterns and changes"};
        
        for (int i = 0; i < 8; i++) {
            topics.add(Topic.builder()
                    .className("Class " + ((i % 5) + 1))
                    .subject(subjects.get(i % subjects.size()))
                    .teacher(teachers.get(i % teachers.size()))
                    .date(LocalDate.now().minusDays(30 - i))
                    .title(titles[i])
                    .description(descriptions[i])
                    .build());
        }
        return topics;
    }

    private List<Video> createVideos(List<Subject> subjects, List<Teacher> teachers) {
        List<Video> videos = new ArrayList<>();
        String[] titles = {"Math Basics Tutorial", "Science Experiments", "English Grammar Lesson", 
                          "History Documentary", "Physics Concepts", "Chemistry Lab Demo", "Biology Explained", "Geography Tour"};
        String[] urls = {"https://example.com/video1", "https://example.com/video2", "https://example.com/video3",
                        "https://example.com/video4", "https://example.com/video5", "https://example.com/video6",
                        "https://example.com/video7", "https://example.com/video8"};
        String[] types = {"Tutorial", "Experiment", "Lesson", "Documentary", "Concept", "Demo", "Explanation", "Tour"};
        
        for (int i = 0; i < 8; i++) {
            videos.add(Video.builder()
                    .title(titles[i])
                    .subject(subjects.get(i % subjects.size()))
                    .url(urls[i])
                    .generatedBy(teachers.get(i % teachers.size()))
                    .videoType(types[i])
                    .build());
        }
        return videos;
    }

    private List<Timetable> createTimetables(List<Subject> subjects, List<Teacher> teachers) {
        List<Timetable> timetables = new ArrayList<>();
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Monday", "Tuesday", "Wednesday"};
        LocalTime[] startTimes = {LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0), LocalTime.of(12, 0),
                                  LocalTime.of(9, 30), LocalTime.of(10, 30), LocalTime.of(11, 30), LocalTime.of(12, 30)};
        LocalTime[] endTimes = {LocalTime.of(10, 0), LocalTime.of(11, 0), LocalTime.of(12, 0), LocalTime.of(13, 0),
                               LocalTime.of(10, 30), LocalTime.of(11, 30), LocalTime.of(12, 30), LocalTime.of(13, 30)};
        
        for (int i = 0; i < 8; i++) {
            timetables.add(Timetable.builder()
                    .className("Class " + ((i % 5) + 1))
                    .subject(subjects.get(i % subjects.size()))
                    .teacher(teachers.get(i % teachers.size()))
                    .dayOfWeek(days[i])
                    .startTime(startTimes[i])
                    .endTime(endTimes[i])
                    .build());
        }
        return timetables;
    }

    private List<Attendance> createAttendances(List<Student> students) {
        List<Attendance> attendances = new ArrayList<>();
        String[] statuses = {"Present", "Absent", "Present", "Late", "Present", "Absent", "Present", "Present"};
        
        for (int i = 0; i < 8; i++) {
            attendances.add(Attendance.builder()
                    .student(students.get(i % students.size()))
                    .date(LocalDate.now().minusDays(7 - i))
                    .status(statuses[i])
                    .email(students.get(i % students.size()).getEmail())
                    .remarks("Regular attendance" + (statuses[i].equals("Absent") ? " - Absent due to illness" : ""))
                    .build());
        }
        return attendances;
    }

    private List<Performance> createPerformances(List<Student> students, List<Assessment> assessments) {
        List<Performance> performances = new ArrayList<>();
        BigDecimal[] marks = {new BigDecimal("85.5"), new BigDecimal("92.0"), new BigDecimal("78.5"), 
                             new BigDecimal("88.0"), new BigDecimal("95.5"), new BigDecimal("82.0"),
                             new BigDecimal("90.0"), new BigDecimal("87.5")};
        String[] grades = {"A", "A+", "B+", "A", "A+", "A-", "A", "A"};
        String[] remarks = {"Excellent work", "Outstanding performance", "Good effort", "Well done",
                          "Exceptional", "Very good", "Excellent", "Great job"};
        
        for (int i = 0; i < 8; i++) {
            performances.add(Performance.builder()
                    .student(students.get(i % students.size()))
                    .assessment(assessments.get(i % assessments.size()))
                    .marksObtained(marks[i])
                    .grade(grades[i])
                    .remarks(remarks[i])
                    .build());
        }
        return performances;
    }

    private List<AssignmentSubmission> createAssignmentSubmissions(List<Assignment> assignments, 
                                                                   List<Student> students, List<Subject> subjects) {
        List<AssignmentSubmission> submissions = new ArrayList<>();
        String[] fileNames = {"homework1.pdf", "project1.docx", "essay1.pdf", "report1.docx", 
                             "labreport1.pdf", "assignment1.docx", "worksheet1.pdf", "map1.jpg"};
        String[] fileTypes = {"application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                             "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                             "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                             "application/pdf", "image/jpeg"};
        
        for (int i = 0; i < 8; i++) {
            // Set fileData to null to avoid bytea mapping issues - files can be uploaded via API
            submissions.add(AssignmentSubmission.builder()
                    .assignment(assignments.get(i % assignments.size()))
                    .student(students.get(i % students.size()))
                    .subject(subjects.get(i % subjects.size()))
                    .fileName(fileNames[i])
                    .filePath("/uploads/" + fileNames[i])
                    .fileData(null) // Will be set when file is actually uploaded via API
                    .fileSize((long) (1024 * (i + 1))) // Sample file size
                    .fileType(fileTypes[i])
                    .notes("Submitted on time with all requirements met")
                    .submittedAt(LocalDateTime.now().minusDays(5 - i))
                    .aiFeedback("Good work! Keep it up.")
                    .build());
        }
        return submissions;
    }

    private List<VideoView> createVideoViews(List<Video> videos, List<Student> students) {
        List<VideoView> views = new ArrayList<>();
        
        for (int i = 0; i < 8; i++) {
            views.add(VideoView.builder()
                    .video(videos.get(i % videos.size()))
                    .student(students.get(i % students.size()))
                    .viewedAt(LocalDateTime.now().minusDays(10 - i))
                    .build());
        }
        return views;
    }

    private List<Payment> createPayments(List<Student> students) {
        List<Payment> payments = new ArrayList<>();
        BigDecimal[] amounts = {new BigDecimal("5000.00"), new BigDecimal("5500.00"), new BigDecimal("6000.00"),
                               new BigDecimal("4500.00"), new BigDecimal("5000.00"), new BigDecimal("5500.00"),
                               new BigDecimal("6000.00"), new BigDecimal("5000.00")};
        String[] statuses = {"Paid", "Pending", "Paid", "Paid", "Pending", "Paid", "Paid", "Pending"};
        String[] modes = {"Online", "Cash", "Cheque", "Online", "Cash", "Online", "Cheque", "Online"};
        
        for (int i = 0; i < 8; i++) {
            payments.add(Payment.builder()
                    .student(students.get(i % students.size()))
                    .amount(amounts[i])
                    .dueDate(LocalDate.now().plusDays(30 - i))
                    .status(statuses[i])
                    .modeOfPayment(modes[i])
                    .endTime(LocalDateTime.now().plusDays(30 - i))
                    .build());
        }
        return payments;
    }

    private List<ExtraActivity> createExtraActivities(List<Student> students) {
        List<ExtraActivity> activities = new ArrayList<>();
        String[] activityNames = {"Football", "Music", "Dance", "Chess", "Debate", "Art", "Swimming", "Drama"};
        String[] achievements = {"Won inter-school tournament", "Performed at annual day", "Won district competition",
                                "State level participant", "Best speaker award", "Art exhibition participant",
                                "Swimming championship winner", "Lead role in school play"};
        String[] statuses = {"Active", "Completed", "Active", "Completed", "Active", "Completed", "Active", "Completed"};
        
        for (int i = 0; i < 8; i++) {
            activities.add(ExtraActivity.builder()
                    .student(students.get(i % students.size()))
                    .activityName(activityNames[i])
                    .achievement(achievements[i])
                    .status(statuses[i])
                    .date(LocalDate.now().minusDays(60 - i))
                    .build());
        }
        return activities;
    }

    private List<ReportStatus> createReportStatuses(List<Student> students) {
        List<ReportStatus> reportStatuses = new ArrayList<>();
        String[] statuses = {"Generated", "Pending", "Generated", "Generated", "Pending", "Generated", "Generated", "Pending"};
        String[] remarks = {"Report ready for review", "Awaiting teacher approval", "Report finalized",
                           "Report sent to parents", "In progress", "Report completed", "Report reviewed", "Under review"};
        
        for (int i = 0; i < 8; i++) {
            reportStatuses.add(ReportStatus.builder()
                    .student(students.get(i % students.size()))
                    .status(statuses[i])
                    .remarks(remarks[i])
                    .build());
        }
        return reportStatuses;
    }

    private List<Notification> createNotifications(List<Student> students, List<Teacher> teachers) {
        List<Notification> notifications = new ArrayList<>();
        String[] messages = {"New assignment posted", "Exam schedule announced", "Parent-teacher meeting scheduled",
                             "Holiday notice", "Fee payment reminder", "Sports day announcement",
                             "Library book return reminder", "Annual day invitation"};
        String[] types = {"Assignment", "Exam", "Meeting", "Notice", "Payment", "Event", "Reminder", "Invitation"};
        String[] statuses = {"Unread", "Read", "Unread", "Read", "Unread", "Read", "Unread", "Read"};
        
        for (int i = 0; i < 8; i++) {
            Integer userId = (i % 2 == 0) ? students.get(i % students.size()).getId() : teachers.get(i % teachers.size()).getId();
            notifications.add(Notification.builder()
                    .userId(userId)
                    .message(messages[i])
                    .type(types[i])
                    .status(statuses[i])
                    .timestamp(LocalDateTime.now().minusDays(5 - i))
                    .build());
        }
        return notifications;
    }

    private List<ChatHistory> createChatHistories(List<Student> students, List<Teacher> teachers) {
        List<ChatHistory> chatHistories = new ArrayList<>();
        String[] messages = {"Hello, I need help with math homework", "Sure, I can help you with that",
                            "When is the assignment due?", "It's due next Friday", "Thank you for the clarification",
                            "You're welcome", "Can we schedule a meeting?", "Yes, let's meet tomorrow"};
        String[] responses = {"Hello! I'd be happy to help you with your math homework.", 
                            "Great! What specific topic are you struggling with?",
                            "The assignment is due on Friday, October 15th.", "You're welcome!",
                            "No problem, feel free to ask if you have more questions.",
                            "Happy to help!", "Sure, I'm available tomorrow at 3 PM.", "Perfect, see you then!"};
        
        for (int i = 0; i < 8; i++) {
            Integer senderId = (i % 2 == 0) ? students.get(i % students.size()).getId() : teachers.get(i % teachers.size()).getId();
            Integer receiverId = (i % 2 == 0) ? teachers.get(i % teachers.size()).getId() : students.get(i % students.size()).getId();
            
            chatHistories.add(ChatHistory.builder()
                    .senderId(senderId)
                    .receiverId(receiverId)
                    .message(messages[i])
                    .timestamp(LocalDateTime.now().minusHours(24 - i))
                    .response(responses[i])
                    .build());
        }
        return chatHistories;
    }
}

