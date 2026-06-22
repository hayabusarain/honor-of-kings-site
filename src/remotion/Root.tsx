import { Composition } from "remotion";
import { TopTierVideo } from "./TopTierVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TopTierVideo"
        component={TopTierVideo}
        durationInFrames={450} // 15 seconds at 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          seed: Math.random(), // used for shadowban prevention mechanics
        }}
      />
    </>
  );
};
