pub struct Tag<'a> {
    property: &'a str,
    content: String,
}

impl Tag<'_> {
    pub fn to_string(&self) -> String {
        format!("<meta property=\"{}\" content=\"{}\" />", self.property, self.content)
    }
}

pub struct EventDetails {
  pub title: String,
  pub description: String,
  pub image_url: String,
  pub start_time: String,
  pub end_time: String,
}

pub struct ClubDetails {
  pub title: String,
  pub description: String,
  pub image_url: String,
}

pub fn tags_from_event_details(details: EventDetails) -> Vec<Tag<'static>> {
  vec![
    Tag { property: "og:title", content: details.title },
    Tag { property: "og:description", content: details.description },
    Tag { property: "og:image", content: details.image_url },
    Tag { property: "event:start_time", content: details.start_time },
    Tag { property: "event:end_time", content: details.end_time },
    Tag { property: "og:site_name", content: String::from("Stevent") },
    Tag { property: "og:type", content: String::from("events.event") },
    Tag { property: "twitter:card", content: String::from("summary_large_image") },
    Tag { property: "theme-color", content: String::from("#b99bff") },
  ]
}

pub fn tags_from_club_details(details: ClubDetails) -> Vec<Tag<'static>> {
  vec![
    Tag { property: "og:title", content: details.title },
    Tag { property: "og:description", content: details.description },
    Tag { property: "og:image", content: details.image_url },
    Tag { property: "og:site_name", content: String::from("Stevent") },
    Tag { property: "twitter:card", content: String::from("summary_large_image") },
    Tag { property: "theme-color", content: String::from("#b99bff") },
  ]
}

pub fn index_with_meta_tags(tags: Vec<Tag<'static>>) -> String {
    // Create meta tags
    let meta_content = tags.iter()
        .map(|tag| tag.to_string())
        .fold(String::new(), |a, b| a + &b + "\n");

    // Read index html file
    let index_contents = std::fs::read_to_string("./static/index.html").expect("Can't find index.html");

    // Insert meta tags
    let head_split : Vec<&str> = index_contents.split("</head>").collect();
    let augmented_contents : String = head_split[0].to_owned() + &meta_content +  "</head>" +  head_split[1];

    augmented_contents
}
