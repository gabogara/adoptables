import React from "react";
import { Link } from "react-router-dom";
import styles from "./List.module.css";

export default function PetCard({ animal, to, backState, children }) {
  const name = animal?.name || "Unnamed";
  const type = animal?.type || "";
  const breed = animal?.breeds?.primary || "";
  const city = animal?.contact?.address?.city || "";
  const state = animal?.contact?.address?.state || "";
  const hasVideo = Array.isArray(animal?.videos) && animal.videos.length > 0;

  const photo =
    animal?.photos?.[0]?.medium ||
    animal?.primary_photo_cropped?.medium ||
    animal?.photos?.[0]?.small ||
    "";

  const Thumb = () =>
    photo ? (
      <img className={styles.thumb} src={photo} alt={`${name} photo`} />
    ) : (
      <div className={styles.thumb} aria-label="No photo available" />
    );

  return (
    <li className={styles.card}>
      <div className={styles.thumbWrap}>
        {to ? (
          <Link to={to} state={backState}>
            <Thumb />
          </Link>
        ) : (
          <Thumb />
        )}
        {hasVideo && <span className={styles.badge}>Video</span>}
      </div>

      {to ? (
        <h4 className={styles.title}>
          <Link to={to} state={backState}>
            {name}
          </Link>
        </h4>
      ) : (
        <h4 className={styles.title}>{name}</h4>
      )}

      <div className={styles.meta}>
        {type}
        {breed ? ` • ${breed}` : ""} {city ? ` • ${city}` : ""}
        {state ? `, ${state}` : ""}
      </div>

      {children && <div className={styles.actions}>{children}</div>}
    </li>
  );
}
