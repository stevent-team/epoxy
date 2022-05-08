pub struct Details {
  pub title: String,
  pub description: String,
  pub image_url: String,
  pub start_time: String,
  pub end_time: String,
}

pub struct Tag<'a> {
    property: &'a str,
    content: String,
}

impl Tag<'_> {
    pub fn to_string(&self) -> String {
        format!("<meta property=\"{}\" content=\"{}\" />", self.property, self.content)
    }
}

pub fn tags_from_details(details: Details) -> Vec<Tag<'static>> {
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
