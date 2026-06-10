import { Component } from '@angular/core';
import { Comment } from 'src/app/PageDataService/professor.service';



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
      }
    ],
    ' Logic and Computation (CSCI2243)': [
      {
        user_id: 'bc_user_103',
        professor_id: 'prof_1',
        course_id: 'CSCI2243',
        createdAt: new Date('2026-03-05T15:45:00'),
        wouldTakeAgain: true,
        message: "Logic and Comp can be dry, but he genuinely brings the material to life. The problem sets are challenging but fair, and he drops your lowest quiz grade. If you pay attention in class and actively use the discussion boards, you will easily secure an A."
      }
    ],
    'Computer Systems (CSCI2271)': [
      {
        user_id: 'bc_user_104',
        professor_id: 'prof_1',
        course_id: 'CSCI2271',
        createdAt: new Date('2026-05-12T11:15:00'),
        wouldTakeAgain: true,
        message: "Systems is notoriously tough at BC, but he is an absolute gem of a professor. He breaks down C programming and memory management flawlessly. The lab exercises are super rewarding. He cares immensely about his students' success. Take him if you get the chance!"
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
      }
    ]
  };
}
