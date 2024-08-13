import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import Login from "@/pages/Login";
import TimeTable from "@/pages/TimeTable";
import UserProfiles from "@/pages/UserProfiles";
import ResultScoreStudent from "@/pages/ResultScoreStudent";
import ControlMeasureScoreStudent from "@/pages/ControlMeasureScoreStudent";
import Profile from "@/pages/Profile";
import ResetUsernameConfirm from "@/pages/ResetUsernameConfirm";
import ResetPasswordConfirm from "@/pages/ResetPasswordConfirm";
import StudyPlan from "@/pages/StudyPlan";
import ScoreTeacher from "@/pages/ScoreTeacher";
import AttendanceTeacher from "@/pages/AttendanceTeacher";
import Teachers from "@/pages/Teachers";
import TeacherInfo from "@/pages/TeacherInfo";
import Certificate from "@/pages/Certificate";
import AdvertisementCreateUpdate from "@/pages/AdvertisementCreateUpdate";
import Advertisement from "@/pages/Advertisement";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound"
import Other from "@/pages/Other"
import AttendanceStudent from "@/pages/AttendanceStudent"
import UpdateAttendanceTeacher from "@/pages/UpdateAttendanceTeacher"

export const router = createRouter({
  history: createWebHistory(),
  mode: "history",
  routes: [
    {
      path: "",
      name: "home",
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/username/reset/:uid/:token",
      name: "username_reset_confirm",
      component: ResetUsernameConfirm,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/password/reset/:uid/:token",
      name: "password_reset_confirm",
      component: ResetPasswordConfirm,
      meta: {
        hideForAuth: true,
      },
    },
    {
      path: "/student",
      name: "student",
      redirect: { name: 'student_timetable' },
      meta: {
        requiresAuth: true,
        requiresStudent: true,
      },
      children: [
        {
          path: "timetable",
          name: "student_timetable",
          component: TimeTable,
        },
        {
          path: "studyplan",
          name: "studyplan",
          component: StudyPlan,
        },
        {
          path: "score",
          name: "student_score",
          redirect: { name: "trimester_score" },
          children: [
            {
              path: "result",
              name: "result_score",
              component: ResultScoreStudent,
            },
            {
              path: "trimester",
              name: "trimester_score",
              component: ControlMeasureScoreStudent,
            },
          ],
        },
        {
          path: "other",
          name: "student_other",
          redirect: { name: "student_other_functions" },
          children: [
            {
              path: "teachers",
              name: "student_teachers",
              redirect: { name: "teachers_info" },
              children: [
                {
                  path: ":teacher_id/info",
                  name: "teacher_info",
                  component: TeacherInfo,
                },
                {
                  path: ":teacher_id/timetable",
                  name: "teacher_timetable_info",
                  component: TimeTable,
                },
                {
                  path: "",
                  name: "teachers_info",
                  component: Teachers,
                },
              ],
            },
            {
              path: "certificate",
              name: "student_certificate",
              component: Certificate,
            },
            {
              path: "advertisement",
              name: "student_advertisements",
              component: Advertisement,
            },
            {
              path: "attendance",
              name: "student_attendance",
              component: AttendanceStudent
            },
            {
              path: "",
              name: "student_other_functions",
              component: Other
            }
          ],
        },
      ],
    },
    {
      path: "/teacher",
      name: "teacher",
      redirect: { name: 'teacher_timetable' },
      meta: {
        requiresAuth: true,
        requiresTeacher: true,
      },
      children: [
        {
          path: "timetable",
          name: "teacher_timetable",
          component: TimeTable,
        },
        {
          path: "score",
          name: "teacher_score",
          component: ScoreTeacher,
        },
        {
          path: "attendance",
          name: "teacher_attendance",
          redirect: { name: 'teacher_attendance_pairs' },
          children: [
            {
              path: "",
              name: "teacher_attendance_pairs",
              component: AttendanceTeacher,
            },
            {
              path: ":pair_id/update",
              name: "teacher_attendance_update",
              component: UpdateAttendanceTeacher,
            }
          ]
        },
        {
          path: "other",
          name: "teacher_other",
          redirect: { name: 'teacher_other_functions' },
          children: [
            {
              path: "advertisement",
              name: "teacher_advertisements",
              redirect: { name: 'teacher_advertisement' },
              children: [
                {
                  path: "",
                  name: "teacher_advertisement",
                  component: Advertisement,
                },
                {
                  path: "create",
                  name: "advertisement_create",
                  component: AdvertisementCreateUpdate,
                },
                {
                  path: "update/:adv_id",
                  name: "advertisement_update",
                  component: AdvertisementCreateUpdate,
                },
              ],
            },
            {
              path: "certificate",
              name: "teacher_certificate",
              component: Certificate,
            },
            {
              path: "",
              name: "teacher_other_functions",
              component: Other
            }
          ],
        },
      ],
    },
    {
      path: "/profile",
      name: "profile",
      redirect: { name: "profile_functions" },
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "change",
          name: "user_profiles",
          component: UserProfiles,
        },
        {
          path: "contact",
          name: "contact",
          component: Contact,
          meta: {
            requiresTeacher: true,
          },
        },
        {
          path: "",
          name: "profile_functions",
          component: Profile,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not_found",
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("Token");
  const role = localStorage.getItem("Role");
  const $userStore = useUserStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: "login", query: { redirect: to.name } });
    } else if (!role && to.name !== "user_profiles") {
      next({ name: "user_profiles", query: { redirect: to.name } });
    }
    else if (to.name === 'home') {
      if (role === 'teacher') {
        next({ name: 'teacher_timetable' })
      }
      else {
        next({ name: 'student_timetable' })
      }
    }
    else if (
      to.matched.some((record) => record.meta.requiresTeacher) &&
      role !== "teacher"
    ) {
      next({ name: "student_timetable" });
    } else if (
      to.matched.some((record) => record.meta.requiresStudent) &&
      role !== "student"
    ) {
      next({ name: "teacher_timetable" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (token) {
      next(
        $userStore.isStudent()
          ? { name: "student_timetable" }
          : { name: "teacher_timetable" }
      );
    } else {
      next();
    }
  } else {
    next();
  }
});
