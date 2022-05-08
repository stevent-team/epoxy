use actix_web::{web, Responder, App, HttpServer, HttpRequest, HttpResponse};
use actix_web::dev::{ServiceRequest, ServiceResponse, fn_service};
use actix_files::NamedFile;
use actix_files as fs;
use std::path::PathBuf;

mod meta;

async fn event(req: HttpRequest) -> impl Responder {
    let path: PathBuf = req.match_info().query("eventid").parse().unwrap();
    println!("Get event: {:?}", path);
    
    // Create event details
    let details = meta::EventDetails {
        title: String::from("Test Event"),
        description: String::from("A cool event you should go to"),
        image_url: String::from("https://storage.googleapis.com/stevent-development-image-bucket/e6d3a632-d10e-49ab-bad5-b558ba58b163"),
        start_time: String::from("2022-05-08T06:40:52"),
        end_time: String::from("2022-05-08T06:40:52"),
    };

    HttpResponse::Ok()
        .content_type("text/html")
        .body(meta::index_with_meta_tags(meta::tags_from_event_details(details)))
}

async fn club(req: HttpRequest) -> impl Responder {
    let path: PathBuf = req.match_info().query("clubid").parse().unwrap();
    println!("Get club: {:?}", path);
    
    // Create event details
    let details = meta::ClubDetails {
        title: String::from("Test Event"),
        description: String::from("A cool event you should go to"),
        image_url: String::from("https://storage.googleapis.com/stevent-development-image-bucket/e6d3a632-d10e-49ab-bad5-b558ba58b163"),
    };

    HttpResponse::Ok()
        .content_type("text/html")
        .body(meta::index_with_meta_tags(meta::tags_from_club_details(details)))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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
    .bind(("localhost", 8080))?
    .run()
    .await
}
