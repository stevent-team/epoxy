use sqlx::postgres::PgPoolOptions;
  
#[derive(sqlx::FromRow)]
pub struct EventDetails {
  pub name: String,
  pub description: String,
  pub image_url: String,
  pub start_date: sqlx::types::chrono::NaiveDateTime,
  pub end_date: sqlx::types::chrono::NaiveDateTime,
}

#[derive(sqlx::FromRow)]
pub struct ClubDetails {
  pub name: String,
  pub description: String,
  pub image_url: String,
}

async fn create_pool() -> Result<sqlx::PgPool, sqlx::Error> {
  let pool = PgPoolOptions::new()
    .max_connections(2)
    .connect("postgresql://postgres:postgres@localhost:5432/stevent").await?;
  Ok(pool)
}

pub async fn query_event_details(event_id: String) -> Result<EventDetails, sqlx::Error> {
  let pool = create_pool().await?;
  let event = sqlx::query_as::<_, EventDetails>("
SELECT \"name\", \"description\", \"startDate\" as start_date, \"endDate\" as end_date, \"imageURL\" as image_url
FROM \"Event\"
WHERE id = $1
  ")
  .bind(event_id)
  .fetch_one(&pool)
  .await?;
  Ok(event)
}

pub async fn query_club_details(club_id: String) -> Result<ClubDetails, sqlx::Error> {
  let pool = create_pool().await?;
  let club = sqlx::query_as::<_, ClubDetails>("
SELECT \"name\", \"description\", \"imageURL\" as image_url
FROM \"Club\"
WHERE id = $1
  ")
  .bind(club_id)
  .fetch_one(&pool)
  .await?;
  Ok(club)
}
