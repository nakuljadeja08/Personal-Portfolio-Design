"use client";

import Image from "next/image";
import { useState } from "react";
import { caseStudyCopy, type Video } from "@/content/caseStudies";
import styles from "./VideoEmbed.module.css";

/**
 * A YouTube video that costs nothing until it's wanted: the page loads one
 * poster image, and YouTube's player (about a megabyte of script) only loads
 * after someone presses play. youtube-nocookie keeps YouTube's cookies off
 * the page until then too.
 */
export function VideoEmbed({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const watch = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {playing ? (
          <iframe
            className={styles.player}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={styles.poster}
            onClick={() => setPlaying(true)}
            aria-label={`${caseStudyCopy.play}: ${video.title}`}
          >
            <Image src={video.poster} alt="" fill sizes="(max-width: 767px) 100vw, 760px" />
            <span className={styles.play} aria-hidden="true" />
          </button>
        )}
      </div>
      <figcaption className={`nl-data ${styles.caption}`}>
        <span>{video.title}</span>
        <a href={watch} target="_blank" rel="noreferrer">
          {caseStudyCopy.watchOn}
        </a>
      </figcaption>
    </figure>
  );
}
