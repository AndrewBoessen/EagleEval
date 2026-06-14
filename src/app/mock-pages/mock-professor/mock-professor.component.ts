import { Component } from '@angular/core';
import { Comment, CourseTableData } from 'src/app/PageDataService/professor.service';



@Component({
  selector: 'mock-professor',
  templateUrl: './mock-professor.component.html',
  styleUrls: ['./mock-professor.component.css']
})
export class MockProfessorComponent {

  mockComments: { [course: string]: Comment[] } = {
    'Computer Science I (CSCI1101)': [
      {
        user_id: 'bc_user_101',
        professor_id: 'prof_1',
        course_id: 'CSCI1101',
        createdAt: new Date('2025-05-14T12:00:00'),
        wouldTakeAgain: true,
        message: "Best computer science professor you can take at BC. His intro class is totally manageable. The lectures are clear, there's a test every other week (so if one doesn't go well, no big deal), and no final. There's a weekly homework and you can get help in office hours or discussion. Interesting class and I learned a lot. I'd definitely recommend it."
      },
      {
        user_id: 'bc_user_106',
        professor_id: 'prof_1',
        course_id: 'CSCI1101',
        createdAt: new Date('2025-05-16T14:22:00'),
        wouldTakeAgain: true,
        message: "Overall manageable, even if you have no prior experience. The homework can take a bit, but starting early guarantees an A."
      }
    ],
    'Computer Science II (CSCI1102)': [
      {
        user_id: 'bc_user_102',
        professor_id: 'prof_1',
        course_id: 'CSCI1102',
        createdAt: new Date('2025-12-18T09:30:00'),
        wouldTakeAgain: true,
        message: "Took him for CS II after surviving a rough semester elsewhere. He makes complex data structures completely click. He's incredibly patient during office hours, and the programming assignments actually prepare you for what's to come. 10/10 would recommend."
      },
      {
        user_id: 'bc_user_108',
        professor_id: 'prof_1',
        course_id: 'CSCI1102',
        createdAt: new Date('2025-12-20T11:45:00'),
        wouldTakeAgain: true,
        message: "Not a fan of Java tbh, but this professor made the pain totally worth it. He explains data structures overall really well which will hopfully help me out in later classes. Linked Lists < Trees imo."
      }
    ],
    ' Logic and Computation (CSCI2243)': [
      {
        user_id: 'bc_user_103',
        professor_id: 'prof_1',
        course_id: 'CSCI2243',
        createdAt: new Date('2026-03-05T15:45:00'),
        wouldTakeAgain: true,
        message: "Logic and Comp can be dry, but he genuinely brings the material to life. The problem sets are challenging but fair, and so are the midterms. If you pay attention in class and actively ask questions, you'll be OK."
      },
      {
        user_id: 'bc_user_109',
        professor_id: 'prof_1',
        course_id: 'CSCI2243',
        createdAt: new Date('2026-03-10T10:05:00'),
        wouldTakeAgain: true,
        message: "Great Prof. Hope to take him again before I graduate!"
      }
    ],
    'Computer Systems (CSCI2271)': [
      {
        user_id: 'bc_user_104',
        professor_id: 'prof_1',
        course_id: 'CSCI2271',
        createdAt: new Date('2026-05-12T11:15:00'),
        wouldTakeAgain: true,
        message: "Systems is notoriously tough at BC, but if you take this professor you'll get through it. He breaks down C programming and memory management very well. He cares immensely about his students' success. Take him if you get the chance!"
      },
      {
        user_id: 'bc_user_110',
        professor_id: 'prof_1',
        course_id: 'CSCI2271',
        createdAt: new Date('2026-05-13T16:30:00'),
        wouldTakeAgain: true,
        message: "This class really forced me to understand low level programming well. I hate seg faults lol."
      },
      {
        user_id: 'bc_user_111',
        professor_id: 'prof_1',
        course_id: 'CSCI2271',
        createdAt: new Date('2026-05-14T13:12:00'),
        wouldTakeAgain: true,
        message: "Best computer science professor you can take. Def go to review sessions because they are insanely helpful in helping you prepare for the exams."
      },
      {
        user_id: 'bc_user_112',
        professor_id: 'prof_1',
        course_id: 'CSCI2271',
        createdAt: new Date('2026-05-15T18:00:00'),
        wouldTakeAgain: false,
        message: "Focus is heavily on assembly language. Not really my favorite but necessary to learn and understand at some point."
      }
    ],
    'Algorithms (CSCI3383)': [
      {
        user_id: 'bc_user_105',
        professor_id: 'prof_5',
        course_id: 'CSCI3383',
        createdAt: new Date('2026-05-20T14:00:00'),
        wouldTakeAgain: true,
        message: "Algorithms is a beast, but the lecture clarity is unmatched. No surprise questions on exams, and everything is pulled straight from the homework concepts and lecture notes. Great intro into graphs, dp, trees, sorting, searching etc."
      },
      {
        user_id: 'bc_user_113',
        professor_id: 'prof_5',
        course_id: 'CSCI3383',
        createdAt: new Date('2026-05-21T11:20:00'),
        wouldTakeAgain: false,
        message: "Dynamic programming broke me. Definitely form a study group for the weekly problem sets."
      },
      {
        user_id: 'bc_user_115',
        professor_id: 'prof_5',
        course_id: 'CSCI3383',
        createdAt: new Date('2026-05-23T15:40:00'),
        wouldTakeAgain: true,
        message: "This class is basically technical interview boot camp. Pay attention to the greedy algorithms section, it pays off big time when looking for internships."
      },
      {
        user_id: 'bc_user_116',
        professor_id: 'prof_5',
        course_id: 'CSCI3383',
        createdAt: new Date('2026-05-24T12:00:00'),
        wouldTakeAgain: true,
        message: "Easily one of the smartest and most down-to-earth professors at BC."
      }
    ]
  };

  mockCourses: CourseTableData[] = [
    {
      id: 'cs_1',
      title: 'Computer Science 1',
      crs_code: 'CSCI1101',
      school: 'MCAS',
      subject: 'Computer Science',
      course_overall: 93,
      description: 'Satisfies Core requirement for Mathematics for CSCI1101 and CSCI1103. This course is an introduction to the art and science of computer programming and to some of the fundamental concepts of computer science. Students will write programs in the Python programming language. Good program design methodology will be stressed throughout. There will also be a study of some of the basic notions of computer science, including computer systems organization, files and some algorithms of fundamental importance.'
    },
    {
      id: 'cs_2',
      title: 'Computer Systems',
      crs_code: 'CSCI2271',
      school: 'MCAS',
      subject: 'Computer Science',
      course_overall: 90,
      description: 'This course is about how computing machines implement the human-friendly abstractions we express in our programs. It reveals the internal representations of data and instructions, as well as the management of data storage in memory, the coordination of processes, and the interactions between operating systems and the programs being executed. Computer Systems explores system behavior and operations in considerable detail. This greater detail is essential for optimizing program performance, for working within the finite memory and word size constraints of computers, for effective debugging, and for systems-level programming. This hands-on course introduces you to the C programming language and techniques of systems programming through extensive coding exercises'
    },
    {
      id: 'cs_3',
      title: 'Computer Science II',
      crs_code: 'CSCI1102',
      school: 'MCAS',
      subject: 'Computer Science',
      course_overall: 85,
      description: 'A course on the fundamentals of programming from a lower-level perspective. Students will learn the basics of C++, a strongly-typed, high-performance language that compiles down to programs that run without a virtual machine. Thecoursewill cover concepts such as the representation of data with bytes, base-2 and base-16 numbers, memory addresses, and memory allocation. Some advanced programming concepts will be discussed, including elementary algorithms, recursion, and the basics of object-oriented programming. In addition to gaining programming experience, students will also be introduced to some common tools and techniques, such as the text-only command interface, file system operations, and version control with Git.'
    },
    {
      id: 'cs_4',
      title: 'Randomness and Computation',
      crs_code: 'CSCI2244',
      school: 'MCAS',
      subject: 'Computer Science',
      course_overall: 75,
      description: 'This course presents the mathematical and computational tools needed to solve problems that involve randomness. For example, an understanding of random variables allows us to efficiently generate the enormous prime numbers needed for information security, and to quantify the expected performance of a machine learning algorithm beyond a small data sample. An understanding of covariance allows high quality compression of audio and video. Topics include combinatorics and counting, random experiments and probability, random variables and distributions, computational modeling of randomness, Bayes\' rule, laws of large numbers, vectors and matrices, covariance and principal axes, and Markov chains.'
    },
    {
      id: 'cs_5',
      title: 'Logic and Computation',
      crs_code: 'CSCI2243',
      school: 'MCAS',
      subject: 'Computer Science',
      course_overall: 85,
      description: 'A course in the mathematical foundations of Computer Science, illustrated throughout with applications such as sets and functions, propositional and predicate logic, induction and recursion, basic number theory, and mathematical models of computation such as formal languages, finite state machines, and Turing machines.'
    },
    {
      id: 'cs_6',
      title: 'Algorithms',
      crs_code: 'CSCI3383',
      school: 'MCAS',
      subject: 'Computer Science',
      course_overall: 95,
      description: 'This course is a study of algorithms for, among other things, sorting, searching, pattern matching, and manipulation of graphs and trees. Emphasis is placed on the mathematical analysis of the time and memory requirements of such algorithms and on general techniques for improving their performance.'
    }
  ];



}
