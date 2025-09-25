use enigo::{Enigo, MouseControllable};
use rand::{thread_rng, Rng};
use std::sync::{Arc, atomic::{AtomicBool, Ordering}};
use std::time::{Duration, Instant};
use tokio::time::sleep;

#[derive(Clone)]
struct Policy { interval_min: u64, interval_max: u64, pixel_min: i32, pixel_max: i32 }

#[tokio::main]
async fn main(){
  let paused = Arc::new(AtomicBool::new(false));
  let last_user = Arc::new(parking_lot::RwLock::new(Instant::now()));
  let policy = Policy { interval_min: 45, interval_max: 120, pixel_min: 1, pixel_max: 3 };
  run_mover(policy, paused, last_user).await;
}

async fn run_mover(policy: Policy, paused: Arc<AtomicBool>, last_user: Arc<parking_lot::RwLock<Instant>>){
  let mut enigo = Enigo::new();
  loop {
    if paused.load(Ordering::Relaxed) { sleep(Duration::from_secs(1)).await; continue; }
    let wait = rand_in(policy.interval_min, policy.interval_max);
    sleep(Duration::from_secs(wait)).await;
    if paused.load(Ordering::Relaxed) { continue; }
    if last_user.read().elapsed().as_secs() < 10 { continue; }
    let (dx, dy) = (rand_px(policy.pixel_min, policy.pixel_max), rand_px(policy.pixel_min, policy.pixel_max));
    enigo.mouse_move_relative(dx, dy);
    enigo.mouse_move_relative(-dx, -dy);
  }
}

fn rand_in(min: u64, max: u64) -> u64 { let mut r = thread_rng(); r.gen_range(min..=max) }
fn rand_px(min: i32, max: i32) -> i32 { let mut r = thread_rng(); let v = r.gen_range(min..=max); if r.gen::<bool>() { v } else { -v } }