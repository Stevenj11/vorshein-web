let done = false;

export function markIntroDone() {
  done = true;
}

export function isIntroDone() {
  return done;
}
