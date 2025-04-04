import{_ as i,c as a,d as n,o as t}from"./app-9PoGKJ3k.js";const l={};function e(p,s){return t(),a("div",null,s[0]||(s[0]=[n(`<p>我遇到了 <code>@Data</code> 注解不生效的问题，发现需要在设置中将 Annotation Processors 中 Default 和具体 profile 的选项都设置为 Obtain processors from project classpath。</p><p>但是每次 mvn clean 之后，profile 的设置就失效。</p><p>再次查询一番，发现 <code>pom.xml</code> 中注释相应语句能够解决。</p><p>涉及到两项，一个是要删除 lombok 依赖的 optional 选项；还有一个是要注释掉插件中的 maven-compiler-plugin</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">dependency</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">    &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">groupId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">org.projectlombok</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">groupId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">    &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">artifactId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">lombok</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">artifactId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--            &lt;optional&gt;true&lt;/optional&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">    &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">version</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">1.18.36</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">version</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">    &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">scope</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">provided</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">scope</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">dependency</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">        </span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">build</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">        &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">plugins</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--            &lt;plugin&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                &lt;configuration&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                    &lt;annotationProcessorPaths&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                        &lt;path&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                            &lt;groupId&gt;org.projectlombok&lt;/groupId&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                            &lt;artifactId&gt;lombok&lt;/artifactId&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                        &lt;/path&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                    &lt;/annotationProcessorPaths&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--                &lt;/configuration&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!--            &lt;/plugin&gt;--&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">            &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">plugin</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">groupId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">org.springframework.boot</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">groupId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">artifactId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">spring-boot-maven-plugin</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">artifactId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">configuration</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                    &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">excludes</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                        &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">exclude</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                            &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">groupId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">org.projectlombok</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">groupId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                            &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">artifactId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">lombok</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">artifactId</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                        &lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">exclude</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                    &lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">excludes</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">                &lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">configuration</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">            &lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">plugin</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">        &lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">plugins</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">    &lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">build</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)]))}const k=i(l,[["render",e]]),r=JSON.parse(`{"path":"/develop/4niqo21q/","title":"IDEA mvn clean 后 Annotation processors 自动失效","lang":"zh-CN","frontmatter":{"title":"IDEA mvn clean 后 Annotation processors 自动失效","createTime":"2025/04/04 04:13:07","permalink":"/develop/4niqo21q/","description":"我遇到了 @Data 注解不生效的问题，发现需要在设置中将 Annotation Processors 中 Default 和具体 profile 的选项都设置为 Obtain processors from project classpath。 但是每次 mvn clean 之后，profile 的设置就失效。 再次查询一番，发现 pom.xml 中...","head":[["meta",{"property":"og:url","content":"https://www.dopplerxd.top/develop/4niqo21q/"}],["meta",{"property":"og:site_name","content":"Doppler's Site"}],["meta",{"property":"og:title","content":"IDEA mvn clean 后 Annotation processors 自动失效"}],["meta",{"property":"og:description","content":"我遇到了 @Data 注解不生效的问题，发现需要在设置中将 Annotation Processors 中 Default 和具体 profile 的选项都设置为 Obtain processors from project classpath。 但是每次 mvn clean 之后，profile 的设置就失效。 再次查询一番，发现 pom.xml 中..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-20T15:06:50.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-20T15:06:50.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"IDEA mvn clean 后 Annotation processors 自动失效\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-20T15:06:50.000Z\\",\\"author\\":[]}"]]},"headers":[],"readingTime":{"minutes":0.65,"words":196},"git":{"updatedTime":1742483210000,"contributors":[{"name":"DopplerXD","username":"DopplerXD","email":"1509209607@qq.com","commits":1,"avatar":"https://avatars.githubusercontent.com/DopplerXD?v=4","url":"https://github.com/DopplerXD"}],"changelog":[{"hash":"f89af5df13a69bef39dd304987634e553ed62cbf","date":1742483210000,"email":"1509209607@qq.com","author":"DopplerXD","message":"note：@Data 注解不生效的问题","commitUrl":"https://github.com/DopplerXD/DopplerXD.github.io/commit/f89af5df13a69bef39dd304987634e553ed62cbf"}]},"autoDesc":true,"filePathRelative":"notes/develop/后端/IDEA mvn clean 后 Annotation processors 自动失效.md"}`);export{k as comp,r as data};
