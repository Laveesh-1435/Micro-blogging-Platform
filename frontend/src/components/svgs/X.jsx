const XSvg = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    viewBox="0 0 100 100"
    fill="white"
    {...props}
  >
    {/*
      4-pointed star (sparkle/compass shape).
      Two overlapping diamond-like paths create the elongated vertical
      and horizontal arms, meeting at the centre with sharp inner cusps.
    */}
    <path d="
      M50 2
      C50 2 44 44 2 50
      C44 50 50 98 50 98
      C50 98 56 56 98 50
      C56 50 50 2 50 2
      Z
    " />
  </svg>
);

export default XSvg;