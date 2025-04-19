function TeacherSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto lg:flex lg:space-x-16">
        <div className="flex-1">
          <h3 className="font-semibold text-text-brand-secondary text-sm lg:text-base">
            你的老師
          </h3>
          <div className="mt-3 text-3xl lg:text-4xl font-semibold">
            錢寶明 (寶哥)
          </div>
          <div className="mt-12 mb-8 h-px bg-border-secondary" />
          <div className="text-text-tertiary lg:text-lg space-y-4 font-inter">
            <p>
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
              suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
              quis montes, sit sit. Tellus aliquam enim urna, etiam.
            </p>
            <p>
              Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat
              mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu
              quis fusce augue enim. Quis at habitant diam at. Suscipit
              tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum
              molestie aliquet sodales id est ac volutpat.
            </p>
            <div className="mt-7 font-semibold text-2xl text-text-primary">
              Closing more clients
            </div>
            <p>
              Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum,
              nulla odio nisl vitae. In aliquet pellentesque aenean hac
              vestibulum turpis mi bibendum diam. Tempor integer aliquam in
              vitae malesuada fringilla.
            </p>
          </div>
        </div>
        <div className="flex-1 mt-12 lg:mt-0">
          <div className="h-[640px] bg-bg-quaternary rounded-md" />
        </div>
      </div>
    </section>
  );
}

export { TeacherSection };
