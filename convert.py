import os
import subprocess
import shutil

# 可修改为你的 mihomo 或 sing-box 路径
COMPILER = "mihomo"   # 或 "sing-box"

def convert_list_to_mrs(input_path, output_path):
    """调用 mihomo/sing-box 将 .list 转为 .mrs"""
    if shutil.which(COMPILER) is None:
        print(f"❌ 未找到 {COMPILER} 可执行文件，请检查路径。")
        return
    
    try:
        subprocess.run(
            [COMPILER, "rule-providers", "compile", "-i", input_path, "-o", output_path],
            check=True
        )
        print(f"✅ 成功生成：{output_path}")
    except subprocess.CalledProcessError as e:
        print(f"❌ 转换失败：{input_path} ({e})")

def batch_convert(directory="."):
    """批量转换目录下所有 .list 文件"""
    for file in os.listdir(directory):
        if file.endswith(".list"):
            input_path = os.path.join(directory, file)
            output_path = input_path.replace(".list", ".mrs")
            convert_list_to_mrs(input_path, output_path)

if __name__ == "__main__":
    folder = input("请输入 .list 文件所在文件夹路径（留空为当前目录）: ").strip() or "."
    batch_convert(folder)
