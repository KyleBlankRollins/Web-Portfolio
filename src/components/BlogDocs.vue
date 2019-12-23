<template>
  <div class="text-primary">
    <ul>
      <li v-for="doc in docs" :key="doc.id" class="w-full my-5">
        <div class="w-full flex justify-center rounded">
          <div class="w-3/4 mx-4 border-l border-primary rounded-l">
            <div class="m-2">
              <div class="flex items-center">
                <h3 class="w-3/4 mb-6">{{ doc.title }}</h3>

                <div class="w-1/4 flex justify-end">
                  <a :href="doc.link" class="btn">
                    <button class="w-full">Read more</button>
                  </a>
                </div>
              </div>
              <p>{{ doc.description }}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "blogDocs",
  data() {
    return {
      docs: [
        {
          id: 0,
          title: "Technical Writer to Scrum Master: Skills",
          description:
            "For technical writers looking to change their career trajectories, Scrum Master roles can be a great fit. Many technical writing skills directly overlap with the Scrum Master skillset or are excellent supplemental skills...",
          link:
            "https://the-canney-valley.kyleblankrollins.com/posts/technical-writer-to-scrum-master-skills"
        },
        {
          id: 1,
          title: "Creating a web development environment with VirtualBox",
          description:
            "Web devlopment can get messy. With so many modules and tools, it's easy to bloat your operating system with applications and files that might conflict with each other. That's why you should use virtual machines...",
          link:
            "https://the-canney-valley.kyleblankrollins.com/posts/creating-a-web-development-environment-with-virtualbox"
        },
        {
          id: 2,
          title: "Installing VirtualBox Guest Additions for your VM",
          description:
            "Once you have a VirtualBox VM with Ubuntu installed, it's time to add VirtualBox's Guest Additions functionality. This gives you a bunch of useful features like better input integration and a shared clipboard for copy and pasting from your host machine into your virtual machine...",
          link:
            "https://the-canney-valley.kyleblankrollins.com/posts/installing-virtualbox-guest-additions-for-your-vm"
        }
      ]
    };
  }
};
</script>
