// Pure animation model: no document access, timers or browser state.
export function buildBirdJourney(distance) {
  // Sample actual arcs: anticipation, ballistic flight and a soft landing.
  // Unequal strides and pauses keep the courier from moving like a metronome.
  const segments = [];
  let clock = 0.55,
    last = 0,
    floor = 0;
  const add = (to, ground, flight, height, pause = 0) => {
    const duration = 0.12 + flight + 0.19 + pause;
    segments.push({
      start: clock,
      end: clock + duration,
      from: last,
      to: to * distance,
      floor,
      ground,
      flight,
      height,
    });
    clock += duration;
    last = to * distance;
    floor = ground;
  };
  add(0.22, -24, 0.46, 21);
  add(0.4, -24, 0.36, 13, 0.09);
  add(0.66, -24, 0.48, 19);
  add(0.83, -24, 0.34, 12, 0.13);
  add(1, -24, 0.4, 16);
  const turnStart = clock;
  clock += 1.05;
  add(0.76, -24, 0.4, 15);
  add(0.47, -24, 0.46, 19, 0.08);
  add(0.2, -24, 0.41, 16);
  add(0, 0, 0.5, 23);
  clock += 0.95;
  const frames = [],
    bagFrames = [],
    wingFrames = [];
  const legFrames = Object.fromEntries(
    [
      "leg-left",
      "leg-right",
      "shin-left",
      "shin-right",
      "foot-left",
      "foot-right",
    ].map((key) => [key, []]),
  );
  const detailFrames = Object.fromEntries(
    [
      "bird-facing",
      "bird-head",
      "bird-beak",
      "bird-eye",
      "bird-far-eye",
      "bird-front-beak",
      "bird-body",
      "bird-chest",
      "bird-tail",
      "bird-far-wing",
    ].map((key) => [key, []]),
  );
  let bagAngle = 0,
    bagVelocity = 0,
    tailAngle = 0,
    tailVelocity = 0;
  const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10),
    mix = (a, b, t) => a + (b - a) * t;
  const count = Math.ceil(clock * 60),
    dt = clock / count;
  for (let i = 0; i <= count; i++) {
    const time = i * dt,
      offset = i / count;
    let x = 0,
      y = 0,
      angle = 0,
      sx = 1,
      sy = 1,
      wing = 0,
      feet = 0,
      bagTarget = 0,
      tail = 0,
      wingLift = 0,
      lookAhead = 0;
    const segment = segments.find(
      (step) => time >= step.start && time < step.end,
    );
    const previous = segments.filter((step) => step.end <= time).at(-1);
    if (previous) {
      x = previous.to;
      y = previous.ground;
    }
    if (segment) {
      const s = segment,
        t = time - s.start,
        direction = Math.sign(s.to - s.from);
      x = s.from;
      y = s.floor;
      if (t < 0.12) {
        const p = smooth(t / 0.12);
        sx = 1 + 0.05 * p;
        sy = 1 - 0.08 * p;
        y += 2 * p;
        angle = -3 * direction * p;
        tail = -7 * p;
        wing = -6 * p;
        lookAhead = direction * Math.sin((Math.PI * t) / 0.24);
      } else if (t < 0.12 + s.flight) {
        const p = (t - 0.12) / s.flight,
          arc = Math.sin(Math.PI * p);
        lookAhead = direction * Math.exp(-6 * p);
        x = mix(s.from, s.to, smooth(p));
        y = mix(s.floor, s.ground, smooth(p)) - 4 * s.height * p * (1 - p);
        sx = 1 - 0.055 * arc;
        sy = 1 + 0.075 * arc;
        angle = direction * (-7 + 12 * p) * arc;
        wingLift = arc;
        wing = -24 * arc - 11 * Math.sin(4 * Math.PI * p) * arc;
        tail = 12 * Math.sin(2 * Math.PI * p) * arc - 6 * arc;
        feet = 18 * arc;
        bagTarget = -direction * 21 * Math.sin(Math.PI * p * 1.35);
      } else {
        const p = Math.min((t - 0.12 - s.flight) / 0.19, 1),
          settle = Math.sin(Math.PI * p) * Math.exp(-2 * p);
        x = s.to;
        y = s.ground + 3 * settle;
        sx = 1 + 0.09 * settle;
        sy = 1 - 0.12 * settle;
        angle = direction * 3 * settle;
        bagTarget = direction * 12 * settle;
        tail = 16 * settle;
        wing = -8 * settle;
      }
    }
    const clamp = (v) => Math.max(0, Math.min(v, 1));
    let turn = smooth(clamp((time - turnStart) / 1.05));
    if (time > clock - 0.9)
      turn = 1 - smooth(clamp((time - clock + 0.9) / 0.9));
    const yaw = turn * Math.PI,
      face = Math.cos(yaw),
      front = Math.sin(yaw);
    // Pivot the same silhouette continuously; do not swap in a different drawing.
    const localLook = lookAhead * (face < 0 ? -1 : 1);
    const headX = 0.9 * localLook,
      headNod = -0.7 * Math.abs(localLook);
    const blinkPhase = (time - (clock - 0.32)) / 0.18;
    const eyelid =
      blinkPhase > 0 && blinkPhase < 1
        ? 1 - 0.94 * Math.sin(Math.PI * blinkPhase) ** 2
        : 1;
    if (front > 0.01) {
      y -= 8 * front;
      angle += 2 * front;
      sx *= 1 + 0.02 * front;
      sy *= 1 - 0.02 * front;
      feet += 4 * Math.sin(turn * 2 * Math.PI) * front;
    }
    bagTarget += front * 5;
    // A damped spring lets the shopping bag lag behind each hop and turn.
    bagVelocity += ((bagTarget - bagAngle) * 125 - bagVelocity * 12) * dt;
    bagAngle += bagVelocity * dt;
    // The tail follows with a small delay and settles after each landing.
    tailVelocity += ((tail - tailAngle) * 160 - tailVelocity * 14) * dt;
    tailAngle += tailVelocity * dt;
    const tailRest = 1 - smooth(clamp((time - clock + 0.4) / 0.4));
    detailFrames["bird-facing"].push({
      offset,
      transform: `scale(${face}, ${1 - 0.035 * front})`,
      opacity: 1,
    });
    detailFrames["bird-head"].push({
      offset,
      transform: `translate(${headX}px, ${headNod}px) rotate(${-6 * localLook}deg)`,
    });
    detailFrames["bird-beak"].push({
      offset,
      transform: "scaleX(1)",
      opacity: 1,
    });
    detailFrames["bird-front-beak"].push({ offset, opacity: 0 });
    detailFrames["bird-eye"].push({
      offset,
      transform: `translate(${0.3 * localLook}px,0) scaleY(${eyelid})`,
    });
    detailFrames["bird-far-eye"].push({
      offset,
      opacity: 0,
      transform: `scaleY(${eyelid})`,
    });
    detailFrames["bird-body"].push({ offset, transform: "scale(1, 1)" });
    detailFrames["bird-chest"].push({ offset, opacity: 0 });
    detailFrames["bird-tail"].push({
      offset,
      transform: `rotate(${tailAngle * tailRest}deg)`,
      opacity: 1,
    });
    detailFrames["bird-far-wing"].push({
      offset,
      opacity: 0.45 * wingLift,
      transform: `rotate(${wing * 0.55}deg)`,
    });
    frames.push({
      offset,
      transform: `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${sx}, ${sy})`,
    });
    bagFrames.push({
      offset,
      transform: `translate(${headX}px, ${headNod}px) rotate(${bagAngle}deg)`,
    });
    wingFrames.push({ offset, transform: `rotate(${wing}deg)` });
    // Separate hip, knee and toes let each foot land and settle independently.
    for (const [side, sign, delay] of [
      ["left", -1, 0],
      ["right", 1, 0.035],
    ]) {
      let hip = feet * 0.15,
        knee = 0,
        lift = 0,
        toes = 0;
      if (segment) {
        const elapsed = time - segment.start;
        if (elapsed < 0.12) {
          const bend = smooth(elapsed / 0.12);
          hip += sign * 10 * bend;
          knee -= sign * 18 * bend;
        } else if (elapsed < 0.12 + segment.flight) {
          const phase = (elapsed - 0.12) / segment.flight,
            fold = Math.sin(Math.PI * phase);
          hip +=
            sign * (22 + 4 * Math.sin(2 * Math.PI * phase + delay * 20)) * fold;
          knee -= sign * 40 * fold;
          lift = -0.8 * fold;
          toes = sign * 7 * fold;
        } else {
          const contact = clamp(
            (elapsed - 0.12 - segment.flight - delay) / 0.19,
          );
          const cushion = Math.sin(Math.PI * contact) * Math.exp(-2 * contact);
          hip += sign * 17 * cushion;
          knee -= sign * 30 * cushion;
          toes = -sign * 5 * cushion;
        }
      }
      const stepPhase =
        (time - (clock - (side === "left" ? 0.85 : 0.59))) / 0.22;
      if (stepPhase > 0 && stepPhase < 1) {
        const step = Math.sin(Math.PI * stepPhase);
        lift -= 1.8 * step;
        hip += sign * 12 * step;
        knee -= sign * 18 * step;
      }
      legFrames["leg-" + side].push({
        offset,
        transform: `translate(0, ${lift}px) rotate(${hip}deg)`,
      });
      legFrames["shin-" + side].push({
        offset,
        transform: `rotate(${knee}deg)`,
      });
      legFrames["foot-" + side].push({
        offset,
        transform: `rotate(${-0.75 * (hip + knee) + toes}deg)`,
      });
    }
  }
  // Ease every joint through phase boundaries rather than snapping to each pose.
  const soften = (keyframes) => {
    let values;
    for (const frame of keyframes) {
      if (!frame.transform) continue;
      const targets = frame.transform
        .match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)
        .map(Number);
      if (!values) values = [...targets];
      const endBlend = smooth(
        Math.max(0, Math.min(1, (frame.offset * clock - clock + 0.18) / 0.18)),
      );
      values = values.map(
        (value, i) =>
          value + (targets[i] - value) * (1 - Math.exp(-dt / 0.045)),
      );
      let i = 0;
      frame.transform = frame.transform.replace(
        /-?\d*\.?\d+(?:e[-+]?\d+)?/gi,
        () => {
          const j = i++;
          return String(mix(values[j], targets[j], endBlend));
        },
      );
    }
  };
  [
    frames,
    bagFrames,
    wingFrames,
    ...Object.values(legFrames),
    ...Object.values(detailFrames),
  ].forEach(soften);

  return {
    frames,
    bagFrames,
    wingFrames,
    legFrames,
    detailFrames,
    duration: clock * 1000,
  };
}
