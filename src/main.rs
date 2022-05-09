use log::info;
use actix_web::{web, Responder, App, HttpServer, HttpRequest, HttpResponse};
use actix_web::dev::{ServiceRequest, ServiceResponse, fn_service};
use actix_files::NamedFile;
use actix_files as fs;

mod meta;
mod database;

async fn event(req: HttpRequest) -> impl Responder {
    let event_id: String = req.match_info().query("eventid").parse().unwrap();
    info!("Add meta tags for event: {:?}", event_id);
    
    // Get event details from DB
    let details = database::query_event_details(event_id).await.expect("Failed to fetch event from DB");

    // Respond with augmented index
    HttpResponse::Ok()
        .content_type("text/html")
        .body(meta::index_with_meta_tags(meta::tags_from_event_details(details)))
}

async fn club(req: HttpRequest) -> impl Responder {
    let club_id: String = req.match_info().query("clubid").parse().unwrap();
    info!("Add meta tags for club: {:?}", club_id);
    
    // Get event details from DB
    let details = database::query_club_details(club_id).await.expect("Failed to fetch club from DB");

    // Respond with augmented index
    HttpResponse::Ok()
        .content_type("text/html")
        .body(meta::index_with_meta_tags(meta::tags_from_club_details(details)))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Init logger
    env_logger::init();

    // Start http server
    println!("Starting http server on port 8080...");
    HttpServer::new(|| {
        App::new()
            /* Route event detail requests */
            .route("/events/{eventid}", web::get().to(event))
            .route("/events/{eventid}/{tail:.*}", web::get().to(event))

            /* Route club detail requests */
            .route("/clubs/{clubid}", web::get().to(club))
            .route("/clubs/{clubid}/{tail:.*}", web::get().to(club))
            
            /* Pass through to static directory, using index.html as a fallback */
            .service(fs::Files::new("/", "./static/")
                .index_file("index.html")
                .default_handler(fn_service(|req: ServiceRequest| async {
                    let (req, _) = req.into_parts();
                    let file = NamedFile::open_async("./static/index.html").await?;
                    let res = file.into_response(&req);
                    Ok(ServiceResponse::new(req, res))
                })))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
