import { Composition } from "remotion";
import { TopTierVideo } from "./TopTierVideo";
import { useEffect, useState } from "react";

export const RemotionRoot: React.FC = () => {
  const [seed, setSeed] = useState(0.5);

  useEffect(() => {
    setSeed(Math.random());
  }, []);

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
          seed: seed, // used for shadowban prevention mechanics
        }}
      />
    </>
  );
};
