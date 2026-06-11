import { Component } from '@angular/core';
import { ProfTableData } from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-mock-class',
  templateUrl: './mock-class.component.html',
  styleUrls: ['./mock-class.component.css']
})
export class MockClassComponent {

  mockProfs: ProfTableData[] = [
    {
      id: "prof_001",
      name: "Prof. Alpha",
      prof_overall: 94,
      profile_image: "../../../assets/profileImage.jpeg",
      comments: [
        {
          user_id: "user_101",
          message: "One of the best professors in the CS department at BC. Explains complex algorithms with absolute ease.",
          createdAt: new Date("2025-05-20"),
          wouldTakeAgain: true,
          professor_id: "prof_001",
          course_id: "CS-3301"
        },
        {
          user_id: "user_102",
          message: "Brilliant mind, but his exams are incredibly tough. You will learn a lot if you put in the work.",
          createdAt: new Date("2025-11-14"),
          wouldTakeAgain: true,
          professor_id: "prof_001",
          course_id: "CS-4402"
        }
      ]
    },
    {
      id: "prof_002",
      name: "Prof. Beta",
      prof_overall: 85,
      profile_image: "../../../assets/profileImage.jpeg",
      comments: [
        {
          user_id: "user_201",
          message: "Very engaging lectures and genuinely cares about student success. Always available during office hours.",
          createdAt: new Date("2025-03-12"),
          wouldTakeAgain: true,
          professor_id: "prof_002",
          course_id: "CS-4402"
        }
      ]
    },
    {
      id: "prof_003",
      name: "Prof. Gamma",
      prof_overall: 42,
      profile_image: "../../../assets/profileImage.jpeg",
      comments: [
        {
          user_id: "user_301",
          message: "Monotone lectures and reads straight off the slides. Hard grader for no clear reason.",
          createdAt: new Date("2025-10-05"),
          wouldTakeAgain: false,
          professor_id: "prof_003",
          course_id: "CS-4402"
        },
        {
          user_id: "user_302",
          message: "Avoid if possible. The syllabus is incredibly disorganized and feedback on assignments is very surface level.",
          createdAt: new Date("2026-01-22"),
          wouldTakeAgain: false,
          professor_id: "prof_003",
          course_id: "CS-4402"
        }
      ]
    },
    {
      id: "prof_004",
      name: "Prof. Delta",
      prof_overall: 98,
      profile_image: "../../../assets/profileImage.jpeg",
      comments: [
        {
          user_id: "user_401",
          message: "An absolute gem of a human being. Makes lectures so engaging, I always wanted to come to class.",
          createdAt: new Date("2025-06-01"),
          wouldTakeAgain: true,
          professor_id: "prof_004",
          course_id: "CS-2201"
        }
      ]
    },
    {
      id: "prof_005",
      name: "Prof. Epsilon",
      prof_overall: 73,
      profile_image: "../../../assets/profileImage.jpeg",
      comments: [
        {
          user_id: "user_501",
          message: "Decent professor, but the homework load is pretty intense. Make sure you don't fall behind on the readings.",
          createdAt: new Date("2025-04-18"),
          wouldTakeAgain: true,
          professor_id: "prof_005",
          course_id: "CS-4402"
        },
        {
          user_id: "user_502",
          message: "He is super passionate about CS, but his grading criteria for homework and exams can be a bit subjective.",
          createdAt: new Date("2025-12-09"),
          wouldTakeAgain: false,
          professor_id: "prof_005",
          course_id: "CS-4402"
        }
      ]
    },
    {
      id: "prof_006",
      name: "Prof. Zeta",
      prof_overall: 89,
      profile_image: "../../../assets/profileImage.jpeg",
      comments: [
        {
          user_id: "user_601",
          message: "Incredibly sharp and brings real-world industry experience into the classroom. Highly recommend her class.",
          createdAt: new Date("2025-08-30"),
          wouldTakeAgain: true,
          professor_id: "prof_006",
          course_id: "CS-4701"
        }
      ]
    }
  ];


}
