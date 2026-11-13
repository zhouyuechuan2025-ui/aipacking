# Bundled component notices

- [Agent Motion registry](https://agent-motion.com/) original scene components are shipped under [MIT](agent-motion.txt). Component versions are listed in src/motion/native-scenes.json.
- [SnapCN original scenes](https://github.com/shadcn-labs/snapcn/tree/18b973d7592adf2099a4d5cc2d8970862a4e1172) use the [MIT license](snapcn-native.txt). The local adapter substitutes installed fonts.
- ShotCraft ListReveal and ResearchCardStackScroll adapt the original [Apache-2.0 source](https://github.com/Vincentwei1021/video-shotcraft/tree/6700db2ba80572ebc777b99d72049679fed9840c), replacing sample content with project inputs.
- The historical ShotCraft expansion adapts [locked Apache-2.0 sources](https://github.com/Vincentwei1021/video-shotcraft/tree/986427ee909a14dfaa96f6fa6cd7cfaa69b55881) to accept project data, text and media. The registry records each legacy ID, original path and SHA-256. [Apache License 2.0](video-shotcraft.txt).

- [Video ShotCraft](https://github.com/Vincentwei1021/video-shotcraft) is the source of the adapted demo components identified by `external/video-shotcraft/` in `src/m5/templates.generated.js`. The demos have been bundled and adapted for this Remotion workbench. [Apache License 2.0](video-shotcraft.txt).
- [Magic UI](https://github.com/magicuidesign/magicui) is the source of adapted visual effects. [MIT License](magicui.txt).

- The Nana 5.0 opener port contains the original Snapcn components and the frame-based TextReveal adaptation. [Snapcn](https://github.com/shadcn-labs/snapcn) · [MIT license](snapcn.txt).
- The mask title and kinetic word stack are from RenderComp's MIT template library at commit f648980e528defb7594e24c6447055f0540f340b. Their wrapper sets the project palette and uses the composition's frame clock. [RenderComp source](https://github.com/RenderComp/free-remotion-templates/tree/f648980e528defb7594e24c6447055f0540f340b) · [MIT license](rendercomp.txt).
- The Nana 5.0 port also includes adapted FlashCut and CornerSpotlightReveal from Video ShotCraft under the Apache license above.
- The 3.0 frame-seekable overlay adapter uses 97 keyframes from [Animate.css v4.1.1](https://github.com/animate-css/animate.css/tree/4aa415199dd4ed7d877d10343e745e8bbb4b7a0c) and 24 keyframes from [Magic CSS](https://github.com/miniMAC/magic/tree/f26d3c3beaf3017c90fb27ac6f67168fac26de06). [Animate.css MIT license](animate-keyframes.txt) · [Magic CSS MIT license](magic-keyframes.txt).
