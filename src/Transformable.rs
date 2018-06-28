pub trait Transformable {
    fn translate (&mut self, position: Vec<f32>);
    fn rotate (&mut self, deg: f32, axis: Vec<f32>);
    fn scale (&mut self, scale: f32);
}
