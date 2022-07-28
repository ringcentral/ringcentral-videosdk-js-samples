import ScreenSharing from "./pages/screenShare";
import VideoMeeting from "./pages/videoMeeting";



const routes = [
    {
        path: "/video-meeting",
        // component: VideoMeeting({}),
        name: 'video'
    },
    {
        path: '/screen-sharing',
        component: ScreenSharing,
        name: 'screen-share'
    }
]

export { routes };