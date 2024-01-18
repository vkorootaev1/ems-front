import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { useNotificationStore } from "./stores/NotificationsStore";
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

export const router = createRouter({
  history: createWebHistory(),
  mode: "history",
  routes: [
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
          children: [
            {
              path: "teachers",
              name: "teachers",
              redirect: { name: "teachers_info" },
              children: [
                {
                  path: "",
                  name: "teachers_info",
                  component: Teachers,
                },
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
              ],
            },
            {
              path: "certificate",
              name: "student_certificate",
              component: Certificate,
            },
            {
              path: "advertisement",
              name: "advertisement_student",
              component: Advertisement,
            },
          ],
        },
      ],
    },
    {
      path: "/attendance",
      name: "student_attendance",
      component: AttendanceTeacher,
    },
    {
      path: "/teacher",
      name: "teacher",
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
          component: AttendanceTeacher,
        },
        {
          path: "other",
          name: "teacher_other",
          children: [
            {
              path: "advertisement",
              name: "advertisement",
              children: [
                {
                  path: "",
                  name: "advertisement_teacher",
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
    } else if (
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
